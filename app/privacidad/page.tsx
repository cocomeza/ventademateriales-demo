import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacidadPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Términos de Privacidad</CardTitle>
          <p className="text-muted-foreground">
            Última actualización: {new Date().toLocaleDateString("es-AR")}
          </p>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">1. Información que Recopilamos</h2>
            <p className="text-muted-foreground mb-4">
              MaterialesYA recopila información que usted nos proporciona directamente, incluyendo:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Información de cuenta (nombre, email, contraseña)</li>
              <li>Información de contacto (dirección, teléfono)</li>
              <li>Información de pedidos y transacciones</li>
              <li>Información de navegación y uso del sitio</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">2. Uso de la Información</h2>
            <p className="text-muted-foreground mb-4">
              Utilizamos la información recopilada para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Procesar y gestionar sus pedidos</li>
              <li>Mejorar nuestros servicios y experiencia del usuario</li>
              <li>Enviar comunicaciones relacionadas con su cuenta y pedidos</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">3. Protección de Datos</h2>
            <p className="text-muted-foreground mb-4">
              Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal 
              contra acceso no autorizado, alteración, divulgación o destrucción. Utilizamos servicios seguros 
              como Supabase para el almacenamiento y procesamiento de datos.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">4. Compartir Información</h2>
            <p className="text-muted-foreground mb-4">
              No vendemos ni alquilamos su información personal a terceros. Podemos compartir información únicamente:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Con proveedores de servicios que nos ayudan a operar nuestro negocio</li>
              <li>Cuando sea requerido por ley o para proteger nuestros derechos</li>
              <li>Con su consentimiento explícito</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">5. Cookies y Tecnologías Similares</h2>
            <p className="text-muted-foreground mb-4">
              Utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar el uso del sitio 
              y personalizar el contenido. Puede configurar su navegador para rechazar cookies, aunque esto 
              puede afectar algunas funcionalidades del sitio.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">6. Sus Derechos</h2>
            <p className="text-muted-foreground mb-4">
              Usted tiene derecho a:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Acceder a su información personal</li>
              <li>Rectificar información incorrecta</li>
              <li>Solicitar la eliminación de sus datos</li>
              <li>Oponerse al procesamiento de sus datos</li>
              <li>Retirar su consentimiento en cualquier momento</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">7. Retención de Datos</h2>
            <p className="text-muted-foreground mb-4">
              Conservamos su información personal durante el tiempo necesario para cumplir con los propósitos 
              descritos en esta política, a menos que la ley requiera o permita un período de retención más largo.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">8. Cambios a esta Política</h2>
            <p className="text-muted-foreground mb-4">
              Podemos actualizar esta política de privacidad ocasionalmente. Le notificaremos sobre cambios 
              significativos publicando la nueva política en esta página y actualizando la fecha de &quot;Última actualización&quot;.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">9. Contacto</h2>
            <p className="text-muted-foreground mb-4">
              Si tiene preguntas o inquietudes sobre esta política de privacidad o sobre cómo manejamos su información, 
              puede contactarnos a través de los canales de comunicación disponibles en el sitio web.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">10. Ley Aplicable</h2>
            <p className="text-muted-foreground mb-4">
              Esta política de privacidad se rige por las leyes de la República Argentina. 
              Cualquier disputa relacionada con esta política estará sujeta a la jurisdicción de los tribunales argentinos.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

