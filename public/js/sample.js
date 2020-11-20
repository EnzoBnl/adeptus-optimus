function getInitParams(letter) {
    if (letter == "A") {
        return {AA0: "87", AA1: "1", AA2: "3", APA0: "0", APA1: "0", APA2: "1", DA0: "1", DA1: "1", DA2: "2", SA0: "4", SA1: "5", SA2: "7", WSBSA0: "3", WSBSA1: "3", WSBSA2: "3", nameA: "29 boyz + boss nob", nameA0: "Boyz Choppa", nameA1: "Boss Nob Choppa", nameA2: "Boss Nob Big Choppa", pointsA: "245",
        optionsA0: {
            "hit_modifier": "",
            "wound_modifier": "",
            "save_modifier": "",
            "reroll_hits": "",
            "reroll_wounds": "",
            "dakka3": "",
            "auto_wounds_on": "",
            "is_blast": "",
            "auto_hit": "",
            "wounds_by_2D6": "",
            "reroll_damages": "",
            "roll_damages_twice": "",
            "snipe": "",
            "hit_explodes": ""
        },
        optionsA1: {
            "hit_modifier": "",
            "wound_modifier": "",
            "save_modifier": "",
            "reroll_hits": "",
            "reroll_wounds": "",
            "dakka3": "",
            "auto_wounds_on": "",
            "is_blast": "",
            "auto_hit": "",
            "wounds_by_2D6": "",
            "reroll_damages": "",
            "roll_damages_twice": "",
            "snipe": "",
            "hit_explodes": ""
        },
        optionsA2: {
            "hit_modifier": "",
            "wound_modifier": "",
            "save_modifier": "",
            "reroll_hits": "",
            "reroll_wounds": "",
            "dakka3": "",
            "auto_wounds_on": "",
            "is_blast": "",
            "auto_hit": "",
            "wounds_by_2D6": "",
            "reroll_damages": "",
            "roll_damages_twice": "",
            "snipe": "",
            "hit_explodes": ""
        }
        };
    } else if (letter == "B") {
        return {AB0: "D6", APB0: "5", DB0: "D6", SB0: "2D6", WSBSB0: "5", nameB0: "Shokk Attack Gun", nameB: "SAG Big Mek", pointsB: "120",
        optionsB0: {
            "hit_modifier": "",
            "wound_modifier": "",
            "save_modifier": "",
            "reroll_hits": "",
            "reroll_wounds": "",
            "dakka3": "",
            "auto_wounds_on": "",
            "is_blast": "",
            "auto_hit": "",
            "wounds_by_2D6": "",
            "reroll_damages": "",
            "roll_damages_twice": "",
            "snipe": "",
            "hit_explodes": ""
          }
        };
    } else {
        console.log("no init params for letter: " + letter);
    }
}
