# Security Specification & Threat Model (Firebase Security Rules)

## 1. Data Invariants and Business Logic Rules
- **Public Read Access**: All visitors can read posts, categories, and SiteConfig documents. No registration or authentication is required to browse content.
- **Admin-Controlled Writes**: Writing, updating, or deleting any document in `posts`, `categories`, or `config` requires direct authentication matching the admin profile (`tiagopw07@gmail.com` or `nelmariotanganica@gmail.com`) with a verified email address (`email_verified == true`).
- **Data Integrity Constraints**:
  - `posts`: Each post must contain required keys (`id`, `titulo`, `artista`, `categoria`, `capa`, `descricao`, `linkDownload`, `destaque`, `data`). The document ID must be valid and size-constrained.
  - `categories`: Each category must contain required keys (`id`, `nome`, `cor`).
  - `config`: Site configurations must contain all contact and social keys.

---

## 2. The "Dirty Dozen" Threat Payloads (Test Suite Design)

Below are twelve malicious operations that must be strictly blocked by our rules:

1. **Anonymous Post Creation**: Unauthenticated user attempts to create a post in `/posts`.
2. **Standard User Privilege Escalation**: Authenticated standard user (not an admin) attempts to modify `/config/site`.
3. **Spoofed Admin Email**: Malicious user attempts to write to `/posts` with a custom token containing the admin email but where `email_verified == false`.
4. **ID Poisoning in Posts**: Admin attempts to create a post with a 10KB string as the postId.
5. **ID Path Injection**: A user tries to create a post at `/posts/../../../etc/passwd`.
6. **Ghost Key Update (Shadow Write)**: An admin attempts to update a post with unapproved field `isUnapprovedSuperAdminField` to gain privileges.
7. **Malicious Link Injection**: Write payload containing extremely large download link URLs (> 1KB) to exhaust system resources or cause phishing risks.
8. **Negative Download Counter**: Malicious user attempts to set post `downloads` to a negative integer.
9. **Category Color Value Poisoning**: Admin attempts to set category color to a 100K string instead of standard hex codes.
10. **Immutability Bypass**: Admin attempts to change a post's `createdAt` or `id` during update.
11. **Client-Controlled Query Spoofing**: Attempt to execute unbounded listing queries bypassing security gates.
12. **Site Config Wipeout**: Client attempts to delete `/config/site` document.

---

## 3. Test Assertions
All the above threats must be blocked and return `PERMISSION_DENIED` at the Firestore Rule level.
