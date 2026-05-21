import { useNavigate } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import UserRoleBadge from './UserRoleBadge';
import { formatDate } from '../../utils/format';

function UserTableRow({ user, onDelete }) {
    const navigate = useNavigate();

    return (
        <tr>
            <td>
                <div className="user-cell">
                    <UserAvatar username={user.username} />
                    <div>
                        <p className="user-cell__name">{user.username}</p>
                        <p className="user-cell__email">{user.email || '—'}</p>
                    </div>
                </div>
            </td>
            <td><UserRoleBadge role={user.role} /></td>
            <td>{user.location || '—'}</td>
            <td>
                <time dateTime={user.createdAt}>
                    {formatDate(user.createdAt)}
                </time>
            </td>
            <td>
                <div className="table-actions">
                    <button
                        type="button"
                        className="btn--icon"
                        title="View user"
                        onClick={() => navigate(`/users/${user.id}`)}
                    >
                        👁
                    </button>
                    <button
                        type="button"
                        className="btn--icon"
                        title="Edit user"
                        onClick={() => navigate(`/users/${user.id}/edit`)}
                    >
                        ✏️
                    </button>
                    <button
                        type="button"
                        className="btn--icon"
                        title="Delete user"
                        onClick={() => onDelete(user)}
                    >
                        🗑
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default UserTableRow;
