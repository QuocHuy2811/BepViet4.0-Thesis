import { Link } from "react-router-dom";
import { getCategories } from "../../services/categoryServices";
import { useEffect, useState } from "react";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="container-fluid px-4 py-4">
           
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h2 fw-bold text-dark">📋 Quản lý danh mục</h1>
                    <p className="text-muted small">Tổng số danh mục: <span className="badge bg-info">{categories.length}</span></p>
                </div>
                <Link className="btn btn-primary" to="/admin/them-danh-muc">Thêm</Link>
            </div>

          
            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

          
            {!loading && categories.length === 0 && (
                <div className="alert alert-info text-center py-5">
                    <h5>Không có danh mục nào</h5>
                    <p>Hãy <Link to="/admin/them-danh-muc" className="text-decoration-none">thêm danh mục mới</Link></p>
                </div>
            )}

          
            {!loading && categories.length > 0 && (
                <div className="card shadow-sm border-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col" className="fw-bold">ID</th>
                                    <th scope="col" className="fw-bold">Tên loại</th>
                                    <th scope="col" className="fw-bold">Slug</th>
                                    <th scope="col" className="fw-bold">Trạng thái</th>
                                    <th scope="col" className="fw-bold text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat) => (
                                    <tr key={cat.id} className="align-middle">
                                        <td>
                                            <span className="badge bg-secondary">{cat.id}</span>
                                        </td>
                                        <td className="fw-medium">{cat.name}</td>
                                        <td>
                                            <code className="bg-light px-2 py-1 rounded">{cat.slug}</code>
                                        </td>
                                        <td>
                                            {cat.status === 0 ? (
                                                <span className="badge bg-success">
                                                    <i className="bi bi-check-circle"></i> Hoạt động
                                                </span>
                                            ) : (
                                                <span className="badge bg-danger">
                                                    <i className="bi bi-lock-fill"></i> Khóa
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            <Link
                                                className="btn btn-sm btn-warning me-2"
                                                to={`/admin/sua-danh-muc/${cat.id}`}
                                                title="Sửa danh mục"
                                            >
                                                <i className="bi bi-pencil"></i> Sửa
                                            </Link>
                                            
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;