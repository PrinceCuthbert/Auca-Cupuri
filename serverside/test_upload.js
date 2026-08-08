import fs from 'fs';
import jwt from 'jsonwebtoken';

const uploadTest = async () => {
    const token = jwt.sign({ id: 1, role: "admin" }, "42db560a333626f5a74385a46b0099219f522ca652e10a0af1138b2ddfa62acd");

    // Create a minimal valid PDF file
    const pdfContent = Buffer.from(
        "255044462d312e340a25e2e3cfd30a312030206f626a0a3c3c202f54797065202f436174616c6f67202f5061676573203220302052203e3e0a656e646f626a0a322030206f626a0a3c3c202f54797065202f5061676573202f4b696473205b33203020525d202f436f756e742031203e3e0a656e646f626a0a332030206f626a0a3c3c202f54797065202f50616765202f506172656e74203220302052202f4d65646961426f78205b30203020363132203739325d203e3e0a656e646f626a0a787265660a3020340a303030303030303030302036353535352066200a30303030303030303135203030303030206e200a30303030303030303638203030303030206e200a30303030303030313235203030303030206e200a747261696c65720a3c3c202f53697a652034202f526f6f74203120302052203e3e0a7374617274787265660a3233300a2525454f460a",
        "hex"
    );
    fs.writeFileSync("test.pdf", pdfContent);

    const formData = new FormData();
    const blob = new Blob([fs.readFileSync("test.pdf")], { type: "application/pdf" });
    formData.append("exam", blob, "test.pdf");
    formData.append("title", "Test PDF");
    formData.append("faculty", "IT");
    formData.append("course", "Networking");
    formData.append("examType", "Midterm");

    try {
        const response = await fetch("http://localhost:3009/api/exams/upload", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", data);
    } catch (e) {
        console.error("Fetch failed", e);
    } finally {
        if (fs.existsSync("test.pdf")) fs.unlinkSync("test.pdf");
    }
};
uploadTest();
