import axios from "axios";
import * as express from "express";
import {get} from "lodash";

import * as faker from 'faker';


import IDocument from "../common/IDocument";
import IUser from "../common/IUser";
import CONFIG from "../config";
import logger from "../logger";


/**
 *
 * @type {Map<number, IDocument>}
 */
const testDocuments = new Map<number, IDocument>();

/**
 *
 * @type {Map<string, IUser>}
 */
const testUsers = new Map<string, IUser>();

const initializationRoute: express.RequestHandler = (req, res) => {
    const {token, documentId: documentId} = req.body.body;
    logger.info(`initialization request: token=${token} documentId=${documentId}`);
    if (!token || !documentId) {
        res.sendStatus(404);
    } else {
        let user = testUsers.get(token);
        if (!user) {
            user = {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                login: faker.internet.userName(),
            };
            testUsers.set(token, user);
        }
        let document = testDocuments.get(documentId);
        if (!document) {
            document = {
                id: documentId,
                title: 'Document about ' + faker.commerce.productName(),
            };
            testDocuments.set(documentId, document);
        }
        res.json({
            document,
            message: 'Initialized successful',
            status: 'success',
            user,
        });

        // todo: use external service to initialize collaboration document
        // axios.get(CONFIG.INITIALIZE_END_POINT + documentId, {
        //   headers: {
        //     Cookie: `TOKEN=${token}`,
        //   },
        // }).then((response) => {
        //   if (response.status === 200) {
        //     const data = response.data.data;
        //     const document: IDocument = {
        //       id: documentId,
        //       title: get(data, "title"),
        //     };
        //     const user: IUser = {
        //       firstName: get(data, "firstName"),
        //       lastName: get(data, "lastName"),
        //       login: get(data, "userName"),
        //     };
        //     res.json({
        //       document,
        //       message: response.data.message,
        //       status: response.data.status,
        //       user,
        //     });
        //   } else {
        //     res.sendStatus(403);
        //   }
        // }).catch((error) => {
        //   logger.error(`initialization request: ${error}`);
        //   res.sendStatus(500);
        // });
    }
};

export default initializationRoute;
