const PageTransition = ({ children }) => {
  return (
    <div className="page-enter">
      {children}
    </div>
  );
};

export default PageTransition;
