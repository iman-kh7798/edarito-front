import { type SVGProps } from "react";

/**
 * Icon set for the app. Every icon is a currentColor SVG sized in `em`, so the
 * caller controls colour with `text-*` and size with `text-[..]` / `font-size`.
 */
type IconProps = SVGProps<SVGSVGElement>;

const Base = ({ children, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    {children}
  </svg>
);

export const ChevronRightIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
  </Base>
);

export const ChevronLeftIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
  </Base>
);

export const BackArrowIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z" />
  </Base>
);

export const CheckIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </Base>
);

export const EyeIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M12 5c-5 0-9.27 3.11-11 7.5C2.73 16.89 7 20 12 20s9.27-3.11 11-7.5C21.27 8.11 17 5 12 5zm0 12a4.5 4.5 0 110-9 4.5 4.5 0 010 9zm0-7.2a2.7 2.7 0 100 5.4 2.7 2.7 0 000-5.4z" />
  </Base>
);

export const EyeSlashIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92A11.8 11.8 0 0023 12c-1.73-4.39-6-7.5-11-7.5-1.4 0-2.73.25-3.97.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2.27 3 1 4.27l2.28 2.28.46.46A11.8 11.8 0 001 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 2.27 3zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
  </Base>
);

export const HeadsetIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M12 1a9 9 0 00-9 9v7a3 3 0 003 3h3v-8H5v-2a7 7 0 0114 0v2h-4v8h4a3 3 0 003-3v-7a9 9 0 00-9-9z" />
  </Base>
);

export const PlusIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
  </Base>
);

export const GridIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm-9 9h7v7H4v-7zm9 0h7v7h-7v-7z" />
  </Base>
);

export const GearIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M19.14 12.94a7.14 7.14 0 000-1.88l2.03-1.58a.5.5 0 00.12-.64l-1.92-3.32a.5.5 0 00-.61-.22l-2.39.96a7.03 7.03 0 00-1.63-.94l-.36-2.54a.5.5 0 00-.5-.42h-3.84a.5.5 0 00-.5.42l-.36 2.54c-.59.24-1.13.56-1.63.94l-2.39-.96a.5.5 0 00-.61.22L2.71 8.84a.5.5 0 00.12.64l2.03 1.58a7.14 7.14 0 000 1.88l-2.03 1.58a.5.5 0 00-.12.64l1.92 3.32c.14.24.42.32.61.22l2.39-.96c.5.38 1.04.7 1.63.94l.36 2.54c.05.24.26.42.5.42h3.84c.24 0 .45-.18.5-.42l.36-2.54c.59-.24 1.13-.56 1.63-.94l2.39.96c.24.1.47.02.61-.22l1.92-3.32a.5.5 0 00-.12-.64l-2.03-1.58zM12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
  </Base>
);

export const PuzzleIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M20.5 11h-2.1a1.5 1.5 0 01-1.4-2.05c.13-.32.2-.67.2-1.04A2.91 2.91 0 0014.28 5c-.37 0-.72.07-1.04.2A1.5 1.5 0 0111.19 3.8V1.7A.7.7 0 0010.49 1H7.8a1 1 0 00-1 1v2.62a1.5 1.5 0 01-2.05 1.4A2.91 2.91 0 003 5.7a2.91 2.91 0 00-1.75 5.25c.32.13.67.2 1.04.2A1.5 1.5 0 013.7 13.19v2.11a1 1 0 001 1H7.2a1.5 1.5 0 001.4-2.05c-.13-.32-.2-.67-.2-1.04a2.91 2.91 0 015.25-1.75c.13.32.2.67.2 1.04a1.5 1.5 0 002.05 1.4h2.6a1 1 0 001-1v-.65z" />
  </Base>
);

export const MenuIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
  </Base>
);

export const CloseIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M18.3 5.71 12 12.01l-6.3-6.3-1.41 1.41 6.3 6.3-6.3 6.29 1.41 1.42 6.3-6.3 6.3 6.3 1.41-1.42-6.3-6.29 6.3-6.3z" />
  </Base>
);

export const UserIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.42 0-9 2.24-9 5v3h18v-3c0-2.76-4.58-5-9-5z" />
  </Base>
);
