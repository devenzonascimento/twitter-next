import { cn } from "@/helpers/cn";
import React from "react";

type SpinnerProps = {
	className?: string;
};

export function Spinner({ className }: SpinnerProps) {
	return (
		<div
			className={cn(
				"block size-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] text-[#1D9BF0]",
				className,
			)}
		>
			<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
				Loading...
			</span>
		</div>
	);
}
