import User from "../models/user.model.js";
import { ApiResponse, errorHandler } from "../utils/response.utils.js";
import { sanitizeUser, generateToken } from "../utils/auth.utils.js";

//login with email and password
export function login(req, res) {
    const { email, password } = req.body;
    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(400).json(ApiResponse({ message: "Invalid email or password", status: false }));
            }
            if (!user.authenticate(password)) {
                return res.status(400).json(ApiResponse({ message: "Invalid password!", status: false }));
            }

            const token = generateToken(user)
            return res.status(200).json(ApiResponse({ data: { user: sanitizeUser(user), token }, message: `Welcome ${user.name}` }));

        })
        .catch((err) => {
            return res.status(400).json(ApiResponse({ message: errorHandler(err), status: false }));
        });
}

//registering a new user then sending them otp to verify and logging them in
export function register(req, res) {
    const { name, email, password } = req.body;

    User.findOne({ email }).then((user) => {
        if (user) {
            return res.status(400).json(ApiResponse({ message: "User with this email already exists", status: false }));
        }

        const newUser = new User({ name, email, password });

        newUser
            .save()
            .then((data) => {
                const token = generateToken(data);
                const response = { user: sanitizeUser(data), token }
                return res.status(200).json(ApiResponse({ data: response, message: "User registered successfully" }));
            })
            .catch((error) => {
                if (error) {
                    return res.status(400).json(ApiResponse({ message: errorHandler(error), status: false }));
                }
            })
    });

}
