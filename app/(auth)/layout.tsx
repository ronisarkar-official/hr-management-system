import { Star, Users } from 'lucide-react';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen">
			{/* Left panel — branding / decorative (desktop only) */}
			<div className="hidden lg:flex lg:w-[480px] xl:w-[560px] relative overflow-hidden flex-col justify-between p-10 xl:p-12 border-r border-border bg-muted text-foreground">
				{/* Logo */}
				<div className="relative z-10 flex items-center gap-3">
					<div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
						<Users className="h-5 w-5" />
					</div>
					<span className="text-xl font-bold tracking-tight">HRMS</span>
				</div>

				{/* Headline */}
				<div className="relative z-10 space-y-5">
					<h1 className="text-[2.5rem] xl:text-5xl font-bold leading-[1.15] tracking-tight">
						Every workday, perfectly aligned.
					</h1>
					<p className="text-base xl:text-lg text-muted-foreground max-w-sm leading-relaxed">
						One place for attendance, leave, payroll, and employee records —
						built to keep your whole team in sync.
					</p>
				</div>

				{/* Testimonial */}
				<div className="relative z-10 space-y-4 rounded-xl bg-background border border-border p-6 shadow-xs">
					<div className="flex gap-1">
						{[...Array(5)].map((_, i) => (
							<Star
								key={i}
								className="h-4 w-4 fill-primary text-primary"
							/>
						))}
					</div>
					<blockquote className="text-foreground/90 text-sm leading-relaxed italic">
						&ldquo;Attendance, leave approvals, and payroll used to live in
						three different spreadsheets. Now our whole HR team runs it from one
						dashboard.&rdquo;
					</blockquote>
					<div className="flex items-center gap-3">
						<div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
							RS
						</div>
						<div>
							<p className="text-sm font-medium text-foreground">Riya Sharma</p>
							<p className="text-xs text-muted-foreground">
								HR Officer, Acme Inc.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Right panel — form */}
			<div className="flex flex-1 items-center justify-center p-6 sm:p-10 bg-background">
				<div className="w-full max-w-[420px]">{children}</div>
			</div>
		</div>
	);
}
