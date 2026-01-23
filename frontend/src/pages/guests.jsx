function Guests() {
    return (
        <div className="Guests">
            <div className="page-header">
                <h2>Guest Management</h2>
                <button>+ Add Guest</button>
            </div>

            <div className="guest-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Group (Family/Friend)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Example Name</td>
                            <td>email@example.com</td>
                            <td>Friend</td>
                            <td>Edit | Delete</td>
                        </tr>

                    </tbody>

                </table>

            </div>
        </div>
    );
}

export default Guests;