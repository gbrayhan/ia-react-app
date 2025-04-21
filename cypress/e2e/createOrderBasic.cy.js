describe('Create Order Flow - Select Handling for MUI', () => {
    before(() => {
        cy.visit('http://localhost:5173/login')
        cy.get('input').eq(0).type('gbrayhan@gmail.com')
        cy.get('input').eq(1).type('qweqwe')
        cy.get('button[type="submit"]').click()
        cy.url().should('include', '/dashboard')
    })

    it('completes full order creation using proper MUI select interaction', () => {
        cy.visit('http://localhost:5173/create-order')
        cy.wait(1000)

        // Paso 0: Información del Paciente y Fecha de Entrega Programada
        cy.get('[data-testid="input-patientName"]').type('Juan Pérez')
        cy.get('[data-testid="input-payroll"]').type('12345')
        cy.get('[data-testid="input-beneficiaryNumber"]').type('789456123')
        cy.get('[data-testid="input-phone"]').type('5512345678')
        cy.get('[data-testid="input-secondaryPhone"]').type('5598765432')
        cy.get('[data-testid="input-zipCode"]').clear().type('07500')
        cy.wait(1000)

        // Selección de Colonia (neighborhood)
        cy.get('#mui-component-select-neighborhoodId').click({ force: true })
        cy.wait(1000)
        cy.get('ul[role="listbox"] li').first().click({ force: true })

        cy.get('[data-testid="input-address"]').type('Av. Central 123')
        cy.get('[data-testid="input-referenceAddress"]').type('Frente al Oxxo')
        cy.get('[data-testid="input-patientEmail"]').type('paciente@example.com')
        cy.get('[data-testid="input-eligibility"]').type('E123456')

        // Selección de Cliente
        cy.get('#mui-component-select-clientId').click({ force: true })
        cy.wait(1000)
        cy.get('ul[role="listbox"] li').first().click({ force: true })

        // Selección de Subcliente
        cy.get('#mui-component-select-subclientId').click({ force: true })
        cy.wait(1000)
        cy.get('ul[role="listbox"] li').first().click({ force: true })

        // Selección de Programa
        cy.get('#mui-component-select-programId').click({ force: true })
        cy.wait(1000)
        cy.get('ul[role="listbox"] li').first().click({ force: true })

        cy.get('[data-testid="input-authorization"]').type('AUTH-001')

        // Nuevo: Fecha de Entrega Programada (ya que ahora está en este paso)
        // cy.get('[data-testid="input-scheduledDeliveryDate"]')
        // .clear()
        // .type('15/05/2025')

        cy.get('[data-testid="btn-next"]').click()
        cy.wait(1000)

        // Paso 1: Información de la Receta
        cy.get('[data-testid="input-prescriptionId"]').type('RX-123')
        cy.get('[data-testid="input-doctorName"]').type('Dra. Sofía Ruiz')

        // Selección de Especialidad del Doctor
        cy.get('#mui-component-select-doctorSpecialty').click({ force: true })
        cy.wait(1000)
        cy.get('ul[role="listbox"] li').contains('Cardiología').click({ force: true })

        cy.get('[data-testid="input-doctorLicenseNumber"]').type('CED-789654')
        cy.get('[data-testid="input-providerId"]').type('PROV-001')

        // Autocomplete ICD: escribir "005", esperar y seleccionar opción
        cy.get('[data-testid="autocomplete-icd"]').clear().type('005')
        cy.wait(1000)
        cy.get('ul[role="listbox"]').should('be.visible')
        cy.wait(1000)
        cy.get('ul[role="listbox"] li').first().click({ force: true })

        cy.get('[data-testid="btn-next"]').click()
        cy.wait(1000)

        // Paso 2: Medicamentos
        cy.get('[data-testid="btn-add-medicine"]').click()
        cy.wait(1000)
        cy.get('[data-testid="autocomplete-medicine"]').type('naprox')
        cy.wait(1000)
        cy.get('ul[role="listbox"]').should('be.visible')
        cy.wait(1000)
        cy.get('ul[role="listbox"] li').first().click({ force: true })

        cy.get('[data-testid="input-medicine-quantity"]').type('2')
        cy.get('[data-testid="input-medicine-salePrice"]').type('150')
        cy.get('[data-testid="input-medicine-dosage"]').type('1')

        // Selección de Unidad de Dosis
        cy.get('#mui-component-select-dosis_unidad').click({ force: true })
        cy.wait(1000)
        cy.get('ul[role="listbox"] li').contains('tableta(s)').click({ force: true })

        // Selección de Frecuencia
        cy.get('[data-testid="input-medicine-frequencyQuantity"]').type('3')
        cy.get('#mui-component-select-frecuencia_unidad').click({ force: true })
        cy.wait(1000)
        cy.get('ul[role="listbox"] li').contains('Día(s)').click({ force: true })

        // Selección de Duración
        cy.get('[data-testid="input-medicine-durationQuantity"]').type('15')
        cy.get('#mui-component-select-duration_unidad').click({ force: true })
        cy.wait(1000)
        cy.get('ul[role="listbox"] li').contains('Día(s)').click({ force: true })

        // Selección de extras
        cy.get('[data-testid="input-medicine-notes"]').type('Tomar con comida')

        cy.get('[data-testid="btn-save-medicine"]').click()
        cy.wait(1000)
        cy.get('[data-testid="btn-next"]').click()
        cy.wait(500)

        // Paso 3: Información Adicional
        cy.get('[data-testid="input-additionalComments"]').type('Llamar antes de entregar')
        cy.get('[data-testid="btn-submit"]').click()

        cy.contains('Orden creada correctamente').should('be.visible')
    })
})
