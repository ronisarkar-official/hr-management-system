import { Star, Zap } from 'lucide-react';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen">
			{/* Left panel — branding / decorative (desktop only) */}
			<div className="hidden lg:flex lg:w-[480px] xl:w-[560px] relative overflow-hidden flex-col justify-between p-10 xl:p-12 bg-gradient-to-br from-brand-navy-dark via-brand-navy-mid to-brand-navy-light text-white border-r border-white/5">
				{/* Background decorative elements */}
				<div
					className="absolute inset-0 opacity-[0.03] pointer-events-none"
					style={{
						backgroundImage:
							"linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
						backgroundSize: "30px 30px",
					}}
				/>
				<div className="absolute -top-24 -left-24 size-80 rounded-full bg-brand-lime/10 blur-3xl pointer-events-none" />

				{/* Logo */}
				<div className="relative z-10 flex items-center gap-2">
					<div className="size-9 rounded-xl bg-brand-lime flex items-center justify-center text-brand-navy-dark shadow-md shadow-brand-lime/20">
						<Zap className="size-5 fill-current" />
					</div>
					<span className="text-xl font-bold tracking-tight text-white font-sans">
						Hr<span className="text-brand-lime">Flow</span>
					</span>
				</div>

				{/* Headline */}
				<div className="relative z-10 space-y-5">
					<h1 className="text-[2.25rem] xl:text-[2.75rem] font-extrabold leading-[1.15] tracking-tight text-white font-sans">
						Unify Every Part Of Your <span className="text-brand-lime bg-gradient-to-r from-brand-lime to-lime-300 bg-clip-text text-transparent">HR Process</span>.
					</h1>
					<p className="text-sm xl:text-base text-white/70 max-w-sm leading-relaxed font-sans font-light">
						A Modern HR Solution Designed To Save Time, Reduce Complexity, And Empower Your People.
					</p>
				</div>

				{/* Testimonial */}
				<div className="relative z-10 space-y-4 rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-md shadow-lg shadow-black/10">
					<div className="flex gap-0.5">
						{[...Array(5)].map((_, i) => (
							<Star
								key={i}
								className="h-4 w-4 fill-brand-lime text-brand-lime"
							/>
						))}
					</div>
					<blockquote className="text-white/90 text-xs xl:text-sm leading-relaxed italic font-sans font-light">
						&ldquo;HrFlow has completely transformed our HR operations. We've saved countless hours by automating tasks, and our team collaboration has never been better!&rdquo;
					</blockquote>
					<div className="flex items-center gap-3 pt-2 border-t border-white/5">
						<div className="h-9 w-9 rounded-full bg-brand-lime text-brand-navy-dark flex items-center justify-center text-xs font-black shadow-md shadow-brand-lime/20">
							WW
						</div>
						<div>
							<p className="text-xs xl:text-sm font-bold text-white font-sans">Wade Warren</p>
							<p className="text-[10px] xl:text-xs text-white/50 font-sans">
								Product Designer, TechCorp
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Right panel — form */}
			<div className="flex flex-1 items-center justify-center p-6 sm:p-10 bg-white">
				<div className="w-full max-w-[420px]">{children}</div>
			</div>
		</div>
	);
}
