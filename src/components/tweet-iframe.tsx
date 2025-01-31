"use client";

import { cn } from "@/helpers/cn";
import Image from "next/image";
import { useState } from "react";

export function TweetIframe({ src, block }: { src: string; block?: boolean }) {
	const [isLoading, setIsLoading] = useState(block);

	return (
		<div className="relative w-[270px]">
			<iframe
				title=" "
				// src={`https://twitframe.com/show?url=${src ?? "https%3A%2F%2Ftwitter.com%2Felonmusk%2Fstatus%2F20"}`}
				src={
					src
						? `https://twitframe.com/show?url=${src}`
						: "https://twitframe.com/show?url=https%3A%2F%2Ftwitter.com%2Felonmusk%2Fstatus%2F20"
				}
				className={cn(
					"w-full h-[240px] border-0 pointer-events-none",
					isLoading && "blur-sm",
				)}
				scrolling="no"
			/>

			{isLoading && (
				<Image
					src="/cadeado.png"
					alt="Imagem do Cadeado"
					className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 size-[100px]"
					width={100}
					height={100}
					priority
				/>
			)}
		</div>
	);
}
