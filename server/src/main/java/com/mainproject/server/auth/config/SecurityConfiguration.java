package com.mainproject.server.auth.config;

import com.mainproject.server.auth.filter.JwtAuthenticationFilter;
import com.mainproject.server.auth.filter.JwtVerificationFilter;
import com.mainproject.server.auth.handler.*;
import com.mainproject.server.auth.jwt.JwtTokenizer;
import com.mainproject.server.auth.userdetails.MemberDetailsService;
import com.mainproject.server.auth.utils.CustomAuthorityUtils;
import com.mainproject.server.user.repository.UserRepository;
import com.mainproject.server.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true) // 메서드 수준의 보안 활성화
@RequiredArgsConstructor
public class SecurityConfiguration implements WebMvcConfigurer {

    private final JwtTokenizer jwtTokenizer;
    private final CustomAuthorityUtils authorityUtils;
    private final UserService userService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .cors().configurationSource(corsConfigurationSource())  //기본설정의 cors가 아닌 아래 @Bean으로 등록한 cors설정 적용
                .and()
                .headers().frameOptions().sameOrigin()
                .and()
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .formLogin().disable()
                .httpBasic().disable()
                .exceptionHandling()
                .authenticationEntryPoint(new MemberAuthenticationEntryPoint())
                .accessDeniedHandler(new MemberAccessDeniedHandler())
                .and()
                .apply(new CustomFilterConfigurer())
                .and()
                .authorizeHttpRequests(authorize -> authorize
                        .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // # user 관련
                        // role값 인식 못함
                        .antMatchers(HttpMethod.POST, "/join/**").permitAll()
                        .antMatchers(HttpMethod.POST, "/login").permitAll()
                        .antMatchers(HttpMethod.POST, "/logout").permitAll()
                        .antMatchers(HttpMethod.GET, "/mypage/**").hasAnyRole("USER", "STORE")
                        .antMatchers(HttpMethod.PATCH, "/mypage/**").hasAnyRole("USER", "STORE")
                        .antMatchers(HttpMethod.DELETE, "/mypage/**").hasAnyRole("USER", "STORE")


                        // # feed 관련
                        .antMatchers(HttpMethod.GET, "/").permitAll()
                        .antMatchers(HttpMethod.GET, "/store").permitAll()
                        .antMatchers(HttpMethod.GET, "/feed/detail/**").permitAll()
                        .antMatchers(HttpMethod.POST, "/feed/add/**").hasAnyRole("USER", "STORE")
                        .antMatchers(HttpMethod.PATCH, "/feed/detail/**").hasAnyRole("USER", "STORE")
                        .antMatchers(HttpMethod.DELETE, "/feed/detail/**").hasAnyRole("USER", "STORE")

                        // # feed 댓글 관련
                        .antMatchers(HttpMethod.POST, "/feed/detail/*/comment").hasAnyRole("USER", "STORE")
                        .antMatchers(HttpMethod.PATCH, "/feed/detail/*/comment/**").hasAnyRole("USER", "STORE")
                        .antMatchers(HttpMethod.DELETE, "/feed/detail/*/comment/**").hasAnyRole("USER", "STORE")

                        // # follow 관련
                        .antMatchers(HttpMethod.POST, "/follow/*").hasAnyRole("USER", "STORE")
                        .antMatchers(HttpMethod.GET, "/follow/**").permitAll()

                        // # like 관련
                        .antMatchers(HttpMethod.POST, "/feed/detail/*/like").hasAnyRole("USER", "STORE")

                        // # report 관련
                        .antMatchers(HttpMethod.POST, "/feed/detail/*/report").hasAnyRole("USER", "STORE")
                        .antMatchers(HttpMethod.GET, "/reports").hasRole("ADMIN")


                        .anyRequest().permitAll()

                )
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(new OAuth2MemberSuccessHandler(jwtTokenizer, authorityUtils, userService))
                );

        return httpSecurity.build();
    }


    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("*"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("*" /*,"Authorization","Refresh"*/));
        configuration.addAllowedHeader("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    public class CustomFilterConfigurer extends AbstractHttpConfigurer<CustomFilterConfigurer, HttpSecurity> {
        @Override
        public void configure(HttpSecurity builder) throws Exception {
            AuthenticationManager authenticationManager = builder.getSharedObject(AuthenticationManager.class);

            JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(authenticationManager, jwtTokenizer);

            jwtAuthenticationFilter.setFilterProcessesUrl("/login");
            jwtAuthenticationFilter.setAuthenticationSuccessHandler(new MemberAuthenticationSuccessHandler());
            jwtAuthenticationFilter.setAuthenticationFailureHandler(new MemberAuthenticationFailureHandler());

            JwtVerificationFilter jwtVerificationFilter = new JwtVerificationFilter(jwtTokenizer, authorityUtils);

            builder
                    .addFilter(jwtAuthenticationFilter)
                    .addFilterAfter(jwtVerificationFilter, OAuth2LoginAuthenticationFilter.class);
        }
    }
}
