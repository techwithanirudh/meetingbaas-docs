declare module 'fumadocs-ui/components/button' {
  import { ButtonHTMLAttributes, ReactNode } from 'react';

  interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost';
    children: ReactNode;
  }

  export function Button(props: ButtonProps): JSX.Element;
}

declare module 'fumadocs-ui/components/input' {
  import { InputHTMLAttributes } from 'react';

  interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

  export function Input(props: InputProps): JSX.Element;
}

declare module 'fumadocs-ui/components/scroll-area' {
  import { HTMLAttributes, ReactNode } from 'react';

  interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
  }

  export function ScrollArea(props: ScrollAreaProps): JSX.Element;
}

declare module 'fumadocs-ui/components/card' {
  import { HTMLAttributes, ReactNode } from 'react';

  interface CardProps extends HTMLAttributes<HTMLDivElement> {
    title?: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    href?: string;
    external?: boolean;
    children?: ReactNode;
  }

  export function Card(props: CardProps): JSX.Element;

  interface CardsProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
  }

  export function Cards(props: CardsProps): JSX.Element;
}
