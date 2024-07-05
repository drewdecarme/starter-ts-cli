import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgClockRewine = ({
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
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2C7.522 2 3.774 4.943 2.5 9H5"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 8v4l2 2M2 12q0 .505.045 1M9 22a10 10 0 0 1-1-.392M3.21 17a11 11 0 0 1-.515-1.154m2.136 3.46q.46.495.977.923"
    />
  </svg>
);
export default SvgClockRewine;
