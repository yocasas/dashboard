function translateClientType(clientType) {
    switch (clientType) {
        case 0:
            return 'Não curado'
        case 2:
            return 'Usuário curado'
        case 5:
            return 'Moderador'
        case 6:
            return 'Administrador'
        case 10:
            return 'Administrador Interno'
        
    }
}