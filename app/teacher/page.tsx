import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {cookieName,sessionFromToken} from '@/lib/auth';
import Studio from '@/components/studio';
export default async function Home(){
 const teacher=await sessionFromToken((await cookies()).get(cookieName())?.value);
 if(!teacher)redirect('/login');
 return <Studio displayName={teacher.displayName} scope={teacher.id}/>;
}
