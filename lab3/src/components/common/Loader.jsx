function Loader() {
    return (
        <div className="loader" role="status" aria-label="Loading content">
            <div className="loader__spinner" aria-hidden="true" />
            <p className="loader__text">Loading…</p>
        </div>
    );
}

export default Loader;
