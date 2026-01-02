'use client';
import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import { createPortal } from 'react-dom';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);

	const { user, logout } = useAuth();   // ← AQUI PEGAMOS O USUÁRIO LOGADO
	const isLogged = !!user;

	const links = [
		{ label: 'Chat', href: '/chatbot' },
		{ label: 'Planos', href: '/plans' },
		{ label: 'Sobre', href: '/about' },
	];

	// React.useEffect(() => {
	// 	document.body.style.overflow = open ? 'hidden' : '';
	// 	return () => (document.body.style.overflow = '');
	// }, [open]);

	return (
		<header
			className={cn('sticky top-0 p-2.5 z-50 w-full border-b border-transparent', {
				'bg-background supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg':
					scrolled,
			})}
		>
			<nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
				<div className="hover:bg-accent rounded-md p-2">
					<img src="logo-DrPilot.png" alt="Logo Dr Pilot" className="h-11 w-11" />
				</div>

				{/* LINKS DESKTOP */}
				<div className="hidden items-center gap-2 md:flex">
					{links.map((link) => (
						<a key={link.label} className={buttonVariants({ variant: 'ghost' })} href={link.href}>
							{link.label}
						</a>
					))}

					{/* BOTÕES DE LOGIN OU MENU LOGADO */}
					{isLogged ? (
						<>
							<Link href="/profile">
								<Button variant="outline">Perfil</Button>
							</Link>
							<Button className='bg-primary/50' variant="destructive" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />

								Sair
							</Button>
						</>
					) : (
						<>
							<Link href="/login">
								<Button variant="outline">Entrar</Button>
							</Link>

							<Link href="/register">
								<Button>Cadastre-se</Button>
							</Link>
						</>
					)}
				</div>

				{/* BOTÃO MOBILE */}
				<Button
					size="icon"
					variant="outline"
					onClick={() => setOpen(!open)}
					className="md:hidden"
					aria-expanded={open}
					aria-controls="mobile-menu"
					aria-label="Toggle menu"
				>
					<MenuToggleIcon open={open} className="size-5" duration={300} />
				</Button>
			</nav>

			{/* MENU MOBILE */}
			<MobileMenu open={open}>
				<div className="grid gap-y-2">
					{links.map((link) => (
						<a
							key={link.label}
							className={buttonVariants({
								variant: 'ghost',
								className: 'justify-start',
							})}
							href={link.href}
						>
							{link.label}
						</a>
					))}
				</div>

				{/* LOGIN / LOGADO — MOBILE */}
				<div className="flex flex-col gap-2 pt-2">
					{isLogged ? (
						<>
							<Link href="/chatbot">
								<Button className="w-full">Dashboard</Button>
							</Link>
							<Button variant="destructive" className="w-full" onClick={logout}>
								Sair
							</Button>
						</>
					) : (
						<>
							<Link href="/login">
								<Button variant="outline" className="w-full bg-transparent">
									Entrar
								</Button>
							</Link>

							<Link href="/register">
								<Button className="w-full">Cadastre-se</Button>
							</Link>
						</>
					)}
				</div>
			</MobileMenu>
		</header>
	);
}

type MobileMenuProps = React.ComponentProps<'div'> & {
	open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
	if (!open || typeof window === 'undefined') return null;

	return createPortal(
		<div
			id="mobile-menu"
			className={cn(
				'bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg',
				'fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden',
			)}
		>
			<div
				data-slot={open ? 'open' : 'closed'}
				className={cn(
					'data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out',
					'size-full p-4',
					className,
				)}
				{...props}
			>
				{children}
			</div>
		</div>,
		document.body,
	);
}
