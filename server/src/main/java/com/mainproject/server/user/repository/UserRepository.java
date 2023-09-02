package com.mainproject.server.user.repository;

import com.mainproject.server.user.entity.User;
import org.hibernate.SessionFactory;
import org.hibernate.dialect.function.StandardSQLFunction;
import org.hibernate.internal.SessionFactoryImpl;
import org.hibernate.type.IntegerType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.websocket.Session;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>{


    Optional<User> findByEmail(String email);
    Optional<User> findByNickname(String nickname);




}
