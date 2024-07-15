// credit to https://gist.github.com/mjbalcueva/b21f39a8787e558d4c536bf68e267398
"use client"

import { forwardRef, useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Input, InputProps } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
	({ className, ...props }, ref) => {
		const [showPassword, setShowPassword] = useState(false)

		return (
			<div className="relative">
				<Input
					type={showPassword ? "text" : "password"}
					className={cn("hide-password-toggle pr-10", className)}
					ref={ref}
					{...props}
				/>
				<button
					className="absolute right-0 top-0 h-full px-3 py-2 rounded-sm opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
					onClick={() => setShowPassword((prev) => !prev)}
				>
					{showPassword ? (
						<EyeIcon
							className="h-4 w-4"
							aria-hidden="true"
						/>
					) : (
						<EyeOffIcon
							className="h-4 w-4"
							aria-hidden="true"
						/>
					)}
					<span className="sr-only">
						{showPassword ? "Hide password" : "Show password"}
					</span>
				</button>

				{/* hides browsers password toggles */}
				<style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
			</div>
		)
	},
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }