//Vérifie que le client est un admin
exports.isadmin = function (client) {
    if (client == admin) {
        return true;
    } else {
        return false;
    }
}
