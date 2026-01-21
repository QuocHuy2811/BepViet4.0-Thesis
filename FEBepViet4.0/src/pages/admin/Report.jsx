import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Report() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/reports')
            .then(res => {
                setReports(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status" />
            </div>
        );
    }

    return (
        <div className="container-fluid px-4 py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-1">Quản lý Báo cáo</h4>
                    <small className="text-muted">
                        Danh sách các báo cáo từ người dùng trong hệ thống
                    </small>
                </div>
                <span className="badge bg-primary-subtle text-primary px-3 py-2">
                    Tổng: {reports.length}
                </span>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light text-uppercase small text-muted">
                            <tr>
                                <th className="ps-4">ID</th>
                                <th>Người tố cáo</th>
                                <th>Tài khoản</th>
                                <th>Đối tượng</th>
                                <th>Loại</th>
                                <th>Lý do</th>
                                <th className="text-center">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map(item => (
                                <tr key={item.id}>
                                    <td className="ps-4 fw-semibold text-muted">
                                        #{item.id}
                                    </td>

                                    <td>
                                        <span className="text-muted">
                                            User #{item.user_id}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="fw-semibold text-dark">
                                                {item.user ? item.user.username : 'N/A'}
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <span className="text-muted">
                                            ID #{item.reportable_id}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="badge rounded-pill bg-info-subtle text-info px-3">
                                            {item.reportable_type}
                                        </span>
                                    </td>

                                    <td style={{ maxWidth: 260 }}>
                                        <p
                                            className="mb-0 text-muted text-truncate"
                                            title={item.reason}
                                        >
                                            {item.reason}
                                        </p>
                                    </td>

                                    <td className="text-center">
                                        {item.status === 'pending' ? (
                                            <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2">
                                                Chưa xử lý
                                            </span>
                                        ) : (
                                            <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2">
                                                Đã xử lý
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Report;