import crypto from 'crypto';
import { StalSessionContext } from '../types.js';

const HIPAA_PATTERNS = {
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  dob: /\b(0[1-9]|1[0-2])[\/.-](0[1-9]|[12]\d|3[01])[\/.-](19|20)\d{2}\b/g,
  phone: /\b(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})\b/g,
  mrn: /\bMRN[-\s]?[A-Z0-9]{6,10}\b/gi
};

export class PiiShieldGateway {
  static sanitizeContext(rawContext: Record<string, unknown>, region = 'US-EAST-1'): {
    sanitized: Record<string, unknown>;
    session: StalSessionContext;
  } {
    const rawString = JSON.stringify(rawContext);
    let cleaned = rawString;

    cleaned = cleaned.replace(HIPAA_PATTERNS.ssn, '[REDACTED_SSN]');
    cleaned = cleaned.replace(HIPAA_PATTERNS.email, '[REDACTED_EMAIL]');
    cleaned = cleaned.replace(HIPAA_PATTERNS.dob, '[REDACTED_DOB]');
    cleaned = cleaned.replace(HIPAA_PATTERNS.phone, '[REDACTED_PHONE]');
    cleaned = cleaned.replace(HIPAA_PATTERNS.mrn, '[REDACTED_MRN]');

    const sessionId = `STAL-SES-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
    const timestamp = new Date().toISOString();

    return {
      sanitized: JSON.parse(cleaned),
      session: {
        sessionId,
        timestamp,
        isSanitized: true,
        geographicRegion: region
      }
    };
  }

  static signSessionToken(session: StalSessionContext, secret: string): string {
    const payload = `${session.sessionId}|${session.timestamp}|${session.geographicRegion}`;
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }
}
