// Shared types, constants, and reusable primitives for the settings dialog

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
	User,
	SlidersHorizontal,
	Bell,
	Settings,
	Users,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SettingsSection =
	| 'profile'
	| 'preferences'
	| 'notifications'
	| 'general'
	| 'people';

export interface NavItem {
	id: SettingsSection;
	label: string;
	icon: React.ElementType;
}

export interface NavGroup {
	title: string;
	items: NavItem[];
}

// ---------------------------------------------------------------------------
// Navigation data
// ---------------------------------------------------------------------------

export const NAV_GROUPS: NavGroup[] = [
	{
		title: 'Account',
		items: [
			{ id: 'profile', label: 'Profile', icon: User },
			{ id: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
			{ id: 'notifications', label: 'Notifications', icon: Bell },
		],
	},
	{
		title: 'Workspace',
		items: [
			{ id: 'general', label: 'General', icon: Settings },
			{ id: 'people', label: 'People', icon: Users },
		],
	},
];

// ---------------------------------------------------------------------------
// Section metadata
// ---------------------------------------------------------------------------

export const SECTION_META: Record<
	SettingsSection,
	{ title: string; description: string }
> = {
	profile: {
		title: 'Profile',
		description: 'Manage your profile, login information, and devices',
	},
	preferences: {
		title: 'Preferences',
		description: 'Customize your app experience',
	},
	notifications: {
		title: 'Notifications',
		description: 'Manage how you receive HR and attendance notifications',
	},
	general: {
		title: 'General',
		description: 'Manage organization and workspace settings',
	},
	people: {
		title: 'People',
		description: 'Manage employees and role permissions',
	},
};

// ---------------------------------------------------------------------------
// Reusable primitives
// ---------------------------------------------------------------------------

export function SettingsRow({
	label,
	description,
	action,
	className,
}: {
	label: string;
	description?: string;
	action?: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				'flex items-center justify-between py-3',
				className,
			)}>
			<div className="flex-1 min-w-0 mr-4">
				<p className="text-sm font-medium text-foreground">{label}</p>
				{description && (
					<p className="text-xs text-muted-foreground mt-0.5">
						{description}
					</p>
				)}
			</div>
			{action && <div className="flex-shrink-0">{action}</div>}
		</div>
	);
}

export function ActionButton({
	children,
	variant = 'default',
	onClick,
	className,
}: {
	children: React.ReactNode;
	variant?: 'default' | 'primary' | 'destructive';
	onClick?: () => void;
	className?: string;
}) {
	return (
		<button
			onClick={onClick}
			className={cn(
				'px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap cursor-pointer',
				variant === 'default' &&
					'border-border bg-background text-foreground hover:bg-muted',
				variant === 'primary' &&
					'border-primary bg-primary text-primary-foreground hover:opacity-90',
				variant === 'destructive' &&
					'border-red-500/20 bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:bg-red-950/60 dark:text-red-400 dark:hover:bg-red-900/60 dark:border-red-800/40',
				className
			)}>
			{children}
		</button>
	);
}

export function Toggle({
	checked = false,
	onChange,
}: {
	checked?: boolean;
	onChange?: (val: boolean) => void;
}) {
	return (
		<button
			role="switch"
			aria-checked={checked}
			onClick={() => onChange?.(!checked)}
			className={cn(
				'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
				checked ? 'bg-blue-500' : 'bg-muted-foreground/30',
			)}>
			<span
				className={cn(
					'inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform',
					checked ? 'translate-x-4.5' : 'translate-x-0.5',
				)}
			/>
		</button>
	);
}
