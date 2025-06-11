export default function Wall({ direction = "top" }) {

    if (direction == "top") {
        return (
            <div
                style={{
                    background: "radial-gradient(circle, #EFE8C2 0%, #C5AC6B 50%, #A88E4E 100%)",
                    boxShadow: `
                    0 0 40px #C5AC6B,
                    0 0 20px #BCA25E,
                    0 0 10px #A88E4E`,
                    borderRadius: "8px 8px 2px 2px",
                    position: "absolute",
                    height: "45%",
                    width: "20px",
                    bottom: "50%",
                    zIndex: 1
                }}>
            </div>
        );
    }
    else if (direction == "bottom") {
        return (
            <div
                style={{
                    background: "radial-gradient(circle, #EFE8C2 0%, #C5AC6B 50%, #A88E4E 100%)",
                    boxShadow: `
                    0 0 40px #C5AC6B,
                    0 0 20px #BCA25E,
                    0 0 10px #A88E4E`,
                    borderRadius: "2px 2px 8px 8px",
                    position: "absolute",
                    height: "45%",
                    width: "20px",
                    top: "50%",
                }}>
            </div>
        );
    }
    else if (direction == "left") {
        return (
            <div
                style={{
                    background: "radial-gradient(circle, #EFE8C2 0%, #C5AC6B 50%, #A88E4E 100%)",
                    boxShadow: `
                    0 0 40px #C5AC6B,
                    0 0 20px #BCA25E,
                    0 0 10px #A88E4E`,
                    borderRadius: "8px 2px 2px 8px",
                    position: "absolute",
                    height: "20px",
                    width: "45%",
                    right: "50%",
                }}>
            </div>
        );
    }
    else if (direction == "right") {
        return (
            <div
                style={{
                    background: "radial-gradient(circle, #EFE8C2 0%, #C5AC6B 50%, #A88E4E 100%)",
                    boxShadow: `
                    0 0 40px #C5AC6B,
                    0 0 20px #BCA25E,
                    0 0 10px #A88E4E`,
                    borderRadius: "2px 8px 8px 2px",
                    position: "absolute",
                    height: "20px",
                    width: "45%",
                    left: "50%",
                }}>
            </div>
        );
    }
}