

interface LinkProps {
    href: string;
    children: React.ReactNode;
    target?: "_blank" | "_self" | "_parent" | "_top";
}

const Link = (props: LinkProps) => {
    return (
        <a
            className="text-blue-500 hover:text-blue-700"
            href={props.href} target={props.target}>
            {props.children}
        </a>
    );
}

export default Link