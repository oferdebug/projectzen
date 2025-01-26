'use client';
import {
    CreditCard,
    LogOut,
    PlusCircle,
    User as UserIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface User {
    email: string;
    user_metadata: {
        avatar_url?: string;
    };
    metadata: {
        full_name?: string;
    };
}

interface UserMenuProps {
    user?: User;
}

export function UserMenu({ user = { email: '', user_metadata: {}, metadata: {} } }: UserMenuProps) {
    const router = useRouter();
    //FIXME - Add auth context
    const { toast } = useToast();

    const handleSignOut = async () => {
        try {
            // Add your auth signout logic here
            // await auth.signOut();
            router.push('/login');
            router.refresh();
        } catch (error: unknown) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Something Went Wrong, Please Try Again Later',
            });
            if (error instanceof Error) {
                console.error('Sign out error:', error.message);
            }
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='ghost'
                    className='relative h-9 w-9 rounded-full border bg-background'
                >
                    {user.user_metadata.avatar_url ? (
                        <Image
                            src={user.user_metadata.avatar_url}
                            alt={user.email || ''}
                            fill
                            className='h-9 w-9 rounded-full object-cover'
                            referrerPolicy='no-referrer'
                        />
                    ) : (
                        <UserIcon className='h-6 w-6' />
                    )}
                    <span className='sr-only'>Open User Menu</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className='w-56' align='end'>
                <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-medium leading-none'>
                            {user.metadata.full_name || user.email}
                        </p>
                        <p className='text-xs leading-none text-muted-foreground'>
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href='/profile' className='w-full cursor-pointer'>
                            <UserIcon className='mr-2 h-4 w-4' />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href='/projects' className='w-full cursor-pointer'>
                            <CreditCard className='mr-2 h-4 w-4' />
                            <span>Projects</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href='/new-project' className='w-full cursor-pointer'>
                        <PlusCircle className='mr-2 h-4 w-4' />
                        <span>New Project</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className='cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400'
                    onSelect={handleSignOut}
                >
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default UserMenu;
