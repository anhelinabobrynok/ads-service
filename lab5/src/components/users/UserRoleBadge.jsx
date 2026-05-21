function UserRoleBadge({ role }) {
    if (role === 'admin') {
        return <span className="badge-admin">Admin</span>;
    }
    return <span className="badge-user">Regular</span>;
}

export default UserRoleBadge;
