export default function Ice({ components }) {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <img
                src="./game8/ice.svg"
                alt="ice"
                style={{
                    width: "40%",
                    height: "40%",
                    objectFit: "contain",
                }}
            />
        </div>
    );
}