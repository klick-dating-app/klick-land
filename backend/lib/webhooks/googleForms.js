"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleFormsWebhook = void 0;
// functions/src/webhooks/googleForms.ts
const functions = __importStar(require("firebase-functions"));
const kanban_1 = require("../helpers/kanban");
/**
 * Webhook para recibir datos de Google Forms.
 * Se espera un POST con: { name, phone, email, message }
 */
exports.googleFormsWebhook = functions.https.onRequest(async (req, res) => {
    // Manejo de CORS manual si es necesario (Firebase Functions lo suele requerir en onRequest)
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).send('');
        return;
    }
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    const { name, phone, email, message } = req.body;
    if (!phone) {
        res.status(400).send('Missing phone number');
        return;
    }
    try {
        const contactName = name || 'Nuevo Lead (Web)';
        const bodyContent = message || `Lead registrado vía Formulario. Email: ${email || 'N/A'}`;
        // Creamos la tarjeta con origen 'form'
        await (0, kanban_1.handleKanbanUpdate)(phone, contactName, bodyContent, 'form');
        functions.logger.info(`Lead created from Google Form: ${contactName} (${phone})`);
        res.status(200).send({ success: true, message: 'Lead imported correctly' });
    }
    catch (error) {
        functions.logger.error('Error in googleFormsWebhook:', error);
        res.status(500).send({ success: false, error: 'Internal Server Error' });
    }
});
//# sourceMappingURL=googleForms.js.map