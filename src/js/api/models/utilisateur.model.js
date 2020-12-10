const sql = require('../../db.js');

// constructeur

const Utilisateur = function(utilisateur){
    this.idUtilisateur = utilisateur.idUtilisateur,
    this.genre = utilisateur.genre,
    this.nom = utilisateur.nom,
    this.prenom = utilisateur.prenom,
    this.dateDeNaissance = utilisateur.dateDeNaissance,
    this.adresse = utilisateur.adresse,
    this.email = utilisateur.email,
    this.telephone = utilisateur.telephone,
    this.motdepasse = utilisateur.motdepasse
};

Utilisateur.create = (newUtilisateur, result) => {
    sql.query("INSERT INTO Utilisateur SET ?", newUtilisateur, (err, res) => {
        if(err){
            console.log("error : ", err);
            result(err, null);
            return;
        }
        console.log("utilisateur créé : ", {idUtilisateur: newUtilisateur.idUtilisateur, ...newUtilisateur});
        result(null,{idUtilisateur: res.insertId})
    })
};

Utilisateur.getAll = result => {
    sql.query("SELECT nom, prenom, genre, dateDeNaissance, adresse, email, telephone FROM Utilisateur", (err, res) => {
        if(err){
            console.log("error : ", err);
            result(err, null);
            return;
        }
        result(null, res);
        return;
    });
};

Utilisateur.isMailUsed = (email, result) => {
    sql.query("SELECT count(*) as count FROM Utilisateur WHERE email = ?", email, (err, res) => {
        if(err){
            console.log("error : ", err);
            result(err, null);
            return;
        }
        var string = JSON.stringify(res);
        var json = JSON.parse(string);
        result(null, json[0].count);
    })
};

Utilisateur.findById = (id, result) => {
    sql.query("SELECT idUtilisateur, nom, prenom, genre, dateDeNaissance, adresse, email, telephone FROM Utilisateur WHERE idUtilisateur = ?", id, (err, res) => {
        if(err){
            console.log("error : ", err);
            result(err, null);
            return;
        }

        if(res.length){
            console.log("found utilisateur", res[0]);
            result(null, res[0]);
            return;
        }

        result({kind: "not_found"}, null);
    })
};

Utilisateur.userExist = (email, motdepasse, result) =>{
    sql.query("SELECT idUtilisateur, nom, prenom, genre, dateDeNaissance, adresse, email, telephone FROM Utilisateur WHERE email=? AND motdepasse=?", [email, motdepasse], (err,res) => {
        if(err){
            console.log("error : ", err);
            result(err, null);
            return
        }
        if(res.length){
            console.log("found utilisateur", res[0]);
            result(null, res[0]);
            return
        }
        result({kind: "not_exist"}, null);
    })
}

Utilisateur.updateById = (id, utilisateur, result) => {
    sql.query("UPDATE Utilisateur SET genre=?, nom=?, prenom=?, dateDeNaissance=?, adresse=?, email=?, telephone=?, motdepasse=? WHERE idUtilisateur=?",
             [utilisateur.genre, utilisateur.nom, utilisateur.prenom, utilisateur.dateDeNaissance, utilisateur.adresse, utilisateur.email, utilisateur.telephone, utilisateur.motdepasse, id], 
             (err, res) => {
                if(err){
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }

                if(res.affectedRows == 0){
                    result({kind: "not_found"}, null);
                    return;
                }

                console.log("updated Utilisateur:", {idUtilisateur: id, ...utilisateur});
                result(null, {idUtilisateur: id, ...utilisateur});  
             
            }
    );
};

Utilisateur.remove = (id, result) => {
    sql.query("DELETE FROM Utilisateur WHERE idUtilisateur = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found Utilisateur with the id
        result({ kind: "not_found" }, null);
        return;
      }
  
      console.log("deleted utilisateur with id: ", id);
      result(null, res);
    });
  };
  
Utilisateur.removeAll = result => {
sql.query("DELETE FROM Utilisateur", (err, res) => {
    if (err) {
    console.log("error: ", err);
    result(null, err);
    return;
    }

    console.log(`deleted ${res.affectedRows} utilisateur`);
    result(null, res);
});
};
  
  module.exports = Utilisateur;