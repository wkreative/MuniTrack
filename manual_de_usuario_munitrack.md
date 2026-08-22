# 📘 Manual de Instrucciones Oficial — Plataforma MuniTrack

Bienvenido a **MuniTrack**, la plataforma multi-tenant para la digitalización del registro de propiedades, inspección municipal, pagos y emisión de certificados con verificación QR criptográfica.

---

## 👥 Roles de Usuario en la Plataforma

| Rol | Descripción de Acceso | Entorno |
| :--- | :--- | :--- |
| **Propietario / Ciudadano** | Registra propiedades, sube documentos, realiza pagos y descarga certificados. | `Portal Ciudadano (/citizen)` |
| **Funcionario Municipal** | Revisa expedientes, pre-valida con Document AI, rechaza/aprueba documentos y emite certificados. | `Portal Municipal (/municipal)` |
| **Supervisor Municipal** | Monitorea tiempos de respuesta, productividad de funcionarios y auditoría. | `Portal Municipal (/municipal)` |
| **Administrador Municipal** | Configura trámites, tarifas de arbitrios, workflows y gestiona personal del municipio. | `Portal Municipal (/municipal)` |
| **Superadministrador SaaS** | Administra municipios inquilinos (Tenants), marcas, planes y recursos globales. | `Super Admin (/superadmin)` |

---

## 1. 🏠 Guía para el Propietario / Ciudadano

### A. Selector de Municipio
1. En la barra superior, seleccione el **Municipio Activo** donde se ubica su propiedad (ej. *San Juan*, *Ponce*, *Mayagüez*, *Caguas*).

### B. Registro de Propiedad y Geolocalizador GIS
1. Vaya a **Mis Propiedades** y haga clic en `+ Registrar Nueva Propiedad`.
2. Ingrese el número de catastro oficial de 15 dígitos (ej. `040-025-112-05-001`).
3. Puede presionar el botón `GIS Mapa` para seleccionar la parcela catastral sobre el mapa georreferenciado del municipio.
4. Complete la dirección física, número de escritura y porcentaje de titularidad.

### C. Seguimiento de Solicitudes y Documentos
1. En **Mis Solicitudes**, seleccione la solicitud activa para ver su línea de tiempo de 6 pasos.
2. Si un documento es marcado en estado **Rechazado** o **Corrección Requerida**:
   - Lea la nota oficial indicada por el funcionario municipal.
   - Presione `Sustituir Documento` para subir la versión corregida (`v2`, `v3`).

### D. Pago de Arbitrios y Cargos Municipales
1. En la pestaña **Pagos Municipales** o al presionar `Proceder al Pago`:
   - **ATH Móvil**: Ingrese su número telefónico registrado y autorice desde su app móvil.
   - **Tarjeta de Crédito / Débito**: Ingrese su tarjeta Visa / MasterCard.
   - **Caja Municipal (Presencial)**: Seleccione *Caja Municipal* para generar un **Boletín de Pago con Código de Barras**. Preséntelo impreso o en su celular en cualquier colecturía municipal.
2. Descargue su recibo oficial de pago en formato PDF.

### E. Descarga y Verificación de Certificados
1. Diríjase a **Certificados** y presione `Descargar PDF Oficial`.
2. El documento generado incluye un sello dorado oficial, firma digital encriptada y un **Código QR**.

---

## 2. 🏛️ Guía para el Funcionario Municipal

### A. Dictamen y Revisión de Expedientes
1. Ingrese al **Portal Municipal (`/municipal`)**.
2. En la **Bandeja de Solicitudes**, busque por número de solicitud, nombre del solicitante o catastro.
3. Presione `Examinar` en los documentos adjuntos.
4. Utilice el botón **Pre-validar con Document AI (OCR)** para verificar automáticamente que el número de catastro y la vigencia en la escritura coincidan con los datos de la propiedad.
5. Seleccione `Aprobar Documento` o `Rechazar / Solicitar Corrección` indicando una razón detallada.

### B. Emisión de Certificados
1. Cuando la solicitud cuenta con todos los documentos aprobados y el pago reconciliado (`DOCS_APPROVED` / `PAID`), presione el botón verde `Emitir Certificado PDF con QR`.
2. El certificado queda firmado e inscripto automáticamente en el registro público del municipio.

### C. Notas Internas Confidenciales
1. Utilice el módulo de mensajes para registrar **Notas Internas Confidenciales** visibles exclusivamente para el personal municipal.

---

## 3. 📊 Guía para el Supervisor y Administrador Municipal

### A. Monitoreo de Productividad
1. Vaya a la pestaña **Productividad de Funcionarios**.
2. Examine el número de casos asignados, completados y el tiempo promedio de resolución por departamento.

### B. Configurador de Workflows y Tarifas
1. Acceda a **Configurador de Workflows**.
2. Modifique la tarifa de los arbitrios y agregue o remueva requisitos documentales por tipo de permiso.

### C. Auditoría Inmutable (Ledger)
1. En **Auditoría Inmutable**, consulte la trazabilidad encadenada criptográficamente (`previousHash` → `currentHash`).
2. Garantiza que ninguna acción pueda ser modificada o eliminada.

---

## 4. ⚡ Guía para el Superadministrador SaaS

### A. Gestión de Municipios Inquilinos (Tenants)
1. Ingrese al portal `/superadmin`.
2. Verifique la lista de municipios activos, sus colores corporativos, dominios asignados (`slug.munitrack.gov.pr`) y uso de almacenamiento en **Google Cloud Storage**.
