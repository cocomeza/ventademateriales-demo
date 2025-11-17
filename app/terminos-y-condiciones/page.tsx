import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TerminosYCondicionesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Términos y Condiciones</CardTitle>
          <p className="text-muted-foreground">
            Última actualización: {new Date().toLocaleDateString("es-AR")}
          </p>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">1. Aceptación de los Términos</h2>
            <p className="text-muted-foreground mb-4">
              Al acceder y utilizar MaterialesYA, usted acepta estar sujeto a estos términos y condiciones de uso. 
              Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">2. Uso del Servicio</h2>
            <p className="text-muted-foreground mb-4">
              MaterialesYA es una plataforma para la gestión y venta de materiales de construcción. 
              Usted se compromete a utilizar el servicio únicamente para fines legales y de acuerdo con estos términos.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">3. Cuentas de Usuario</h2>
            <p className="text-muted-foreground mb-4">
              Para acceder a ciertas funcionalidades, deberá crear una cuenta. Usted es responsable de:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Mantener la confidencialidad de su contraseña</li>
              <li>Proporcionar información precisa y actualizada</li>
              <li>Notificar inmediatamente cualquier uso no autorizado de su cuenta</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">4. Pedidos y Pagos</h2>
            <p className="text-muted-foreground mb-4">
              Los pedidos realizados a través de MaterialesYA están sujetos a disponibilidad de stock. 
              Los precios pueden cambiar sin previo aviso. El pago se realiza mediante los métodos disponibles 
              en la plataforma o mediante WhatsApp según se indique.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">5. Propiedad Intelectual</h2>
            <p className="text-muted-foreground mb-4">
              Todo el contenido de MaterialesYA, incluyendo textos, gráficos, logos, imágenes y software, 
              es propiedad de MaterialesYA o sus proveedores de contenido y está protegido por leyes de propiedad intelectual.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">6. Limitación de Responsabilidad</h2>
            <p className="text-muted-foreground mb-4">
              MaterialesYA no será responsable de ningún daño directo, indirecto, incidental o consecuente 
              que resulte del uso o la imposibilidad de usar nuestro servicio.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">7. Modificaciones</h2>
            <p className="text-muted-foreground mb-4">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">8. Contacto</h2>
            <p className="text-muted-foreground mb-4">
              Si tiene preguntas sobre estos términos y condiciones, puede contactarnos a través 
              de los canales de comunicación disponibles en el sitio web.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

