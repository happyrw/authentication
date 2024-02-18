import UserInfos from '@components/user-infos';
import { currentUser } from '@lib/auth';

const ServerPage = async () => {
  const user = await currentUser();
  return (
    <div>
      <UserInfos user={user} side='Server' />
    </div>
  )
}

export default ServerPage;