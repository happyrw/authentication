"use client";
import UserInfos from '@components/user-infos';
import { useCurrentUser } from '@hooks/use-current-user';

const ClientPage =  () => {
  const user = useCurrentUser();
  return (
    <div>
      <UserInfos user={user} side="Client" />
    </div>
  )
}

export default ClientPage;