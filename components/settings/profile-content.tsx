import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	SettingsRow,
	ActionButton,
	Toggle,
} from '@/components/settings/settings-shared';

interface ProfileContentProps {
	userName: string;
	userEmail: string;
	userAvatar: string;
	userInitials: string;
}

export function ProfileContent({
	userName,
	userEmail,
	userAvatar,
	userInitials,
}: ProfileContentProps) {
	return (
		<div>
			<h2 className="text-2xl font-bold text-foreground">Profile</h2>
			<p className="text-sm text-muted-foreground mt-1">
				Manage your profile, login information, and devices
			</p>

			{/* Account */}
			<div className="mt-8">
				<h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
					Account
				</h3>
				<div className="border-t border-border" />
				<div className="flex items-center gap-4 py-4">
					<Avatar className="h-14 w-14 rounded-full shrink-0">
						<AvatarImage src={userAvatar} alt={userName} />
						<AvatarFallback className="rounded-full bg-primary text-primary-foreground text-lg font-semibold">
							{userInitials}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 min-w-0">
						<p className="text-xs text-muted-foreground mb-1">
							Preferred name
						</p>
						<div className="bg-muted/50 border border-border rounded-md px-3 py-1.5 text-sm font-medium text-foreground w-fit max-w-full truncate">
							{userName}
						</div>
						<p className="text-xs text-muted-foreground mt-2">
							<span className="text-blue-500 hover:underline cursor-pointer">
								Add a photo
							</span>{' '}
							or{' '}
							<span className="text-blue-500 hover:underline cursor-pointer">
								create a custom self-portrait
							</span>
						</p>
					</div>
				</div>
			</div>

			{/* Account Security */}
			<div className="mt-8">
				<h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
					Account security
				</h3>
				<div className="border-t border-border" />

				<SettingsRow
					label="Email"
					description={userEmail}
					action={<ActionButton>Manage emails</ActionButton>}
				/>
				<div className="border-t border-border" />

				<SettingsRow
					label="Password"
					description="Set a password for your account"
					action={<ActionButton>Add password</ActionButton>}
				/>
				<div className="border-t border-border" />

				<SettingsRow
					label="Two-step verification"
					description="Add another layer of security to your account"
					action={
						<ActionButton>Add verification method</ActionButton>
					}
				/>
				<div className="border-t border-border" />

				<SettingsRow
					label="Passkeys"
					description="Sign in with on-device biometric authentication"
					action={<ActionButton>Add passkey</ActionButton>}
				/>
			</div>

			{/* Support */}
			<div className="mt-8">
				<h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
					Support
				</h3>
				<div className="border-t border-border" />

				<SettingsRow
					label="Support access"
					description="Grant support team temporary access to your account to help troubleshoot problems"
					action={<Toggle />}
				/>
			</div>
		</div>
	);
}
