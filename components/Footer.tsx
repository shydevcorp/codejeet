const Footer = () => {
  return (
    <footer className="border-t py-4">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>
          Developed by{" "}
          <a
            href="https://x.com/shydev69"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
          >
            ayush
          </a>{" "}
          •{" "}
          <a
            href="https://github.com/ayush-that/takeubackward"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
          >
            Source Code
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
