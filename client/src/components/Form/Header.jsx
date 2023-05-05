import React from 'react'

export default function Header({title,subtitle,isTextCentered}) {
  return (
		<div className={`${isTextCentered ? "text-center" : ""} mb-5`}>
			<div className="text-2xl font-bold">{title}</div>
			<div className="font-light text-neutral-500 mt-2 pb-2">
				{subtitle}
			</div>
			<hr />
		</div>
  );
}
