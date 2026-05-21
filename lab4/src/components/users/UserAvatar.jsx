import { getInitials } from '../../utils/format';

function UserAvatar({ username, size = 36 }) {
    return (
        <div
            className="user-cell__avatar"
            aria-hidden="true"
            style={{ width: size, height: size, fontSize: size * 0.33 }}
        >
            {getInitials(username)}
        </div>
    );
}

export default UserAvatar;
