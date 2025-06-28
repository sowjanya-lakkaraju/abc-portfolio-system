import mongoose from "mongoose";

const AuditUserLoginSchema = new mongoose.Schema({
    ID: { type: Number, required: true, unique: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    SESSION_ID: { type: String, required: true },
    LOGIN_STATUS: { type: String, required: true },
    LOGIN_DATE_TIME: { type: Date, required: true },
    LOGOUT_DATE_TIME: { type: Date }
});

export default mongoose.model("AuditUserLogin", AuditUserLoginSchema);