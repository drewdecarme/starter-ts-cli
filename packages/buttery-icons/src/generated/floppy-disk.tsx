import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgFloppyDisk = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    color="currentColor"
    viewBox="0 0 24 24"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 22v-3c0-1.886 0-2.828.586-3.414S10.114 15 12 15s2.828 0 3.414.586S16 17.114 16 19v3"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 7h4"
    />
    <path
      stroke="currentColor"
      strokeWidth={1.5}
      d="M3 11.858c0-4.576 0-6.864 1.387-8.314a5 5 0 0 1 .157-.157C5.994 2 8.282 2 12.858 2c1.085 0 1.608.004 2.105.19.479.178.88.512 1.682 1.181l2.196 1.83c1.062.885 1.592 1.327 1.876 1.932C21 7.737 21 8.428 21 9.81V13c0 3.75 0 5.625-.955 6.939a5 5 0 0 1-1.106 1.106C17.625 22 15.749 22 12 22s-5.625 0-6.939-.955a5 5 0 0 1-1.106-1.106C3 18.625 3 16.749 3 13z"
    />
  </svg>
);
export default SvgFloppyDisk;
