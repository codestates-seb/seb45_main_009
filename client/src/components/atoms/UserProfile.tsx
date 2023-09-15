
interface ProfileIndProps {
    feedId: number;
  }

function UserProfile({ feedId }: ProfileIndProps){
    return(
        <div>{feedId}</div>
    )
}

export default UserProfile;