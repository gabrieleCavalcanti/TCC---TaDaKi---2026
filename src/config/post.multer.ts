import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import { Request } from "express";

interface MulterOptions {
    folder: string;
    allowedTypes: string[];
    fileSize: number;
}

const verificaDir = (dir: string): void => {

    if (!fs.existsSync(dir)) {

        fs.mkdirSync(
            dir,
            {
                recursive: true
            }
        );
    }
};

const createMulter = ({
    folder,
    allowedTypes,
    fileSize
}: MulterOptions) => {

    const baseUploadDir =
        path.resolve(
            __dirname,
            "..",
            "..",
            "uploads"
        );

    const uploadDir =
        path.join(
            baseUploadDir,
            folder
        );

    verificaDir(uploadDir);

    console.log(
        "IMAGENS SERÃO SALVAS EM:",
        uploadDir
    );

    const storage =
        multer.diskStorage({

            destination: (
                req,
                file,
                cb
            ) => {

                cb(
                    null,
                    uploadDir
                );
            },

            filename: (
                req,
                file,
                cb
            ) => {

                const hash =
                    crypto
                        .randomBytes(12)
                        .toString("hex");

                const extensao =
                    path.extname(
                        file.originalname
                    );

                cb(
                    null,
                    `${hash}${extensao}`
                );
            }
        });


    const fileFilter:
        multer.Options["fileFilter"] =
        (
            req: Request,
            file,
            cb
        ) => {

            if (
                !allowedTypes.includes(
                    file.mimetype
                )
            ) {

                return cb(
                    new Error(
                        "Tipo de arquivo não permitido"
                    )
                );
            }

            cb(
                null,
                true
            );
        };


    return multer({

        storage,

        limits: {
            fileSize
        },

        fileFilter
    });
};

export default createMulter;