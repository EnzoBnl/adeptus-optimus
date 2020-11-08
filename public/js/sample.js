function getInitParams(letter) {
    if (letter == "A") {
        return {AA0: "87", AA1: "1", AA2: "3", APA0: "0", APA1: "0", APA2: "1", DA0: "1", DA1: "1", DA2: "2", SA0: "4", SA1: "5", SA2: "7", WSBSA0: "3", WSBSA1: "3", WSBSA2: "3", nameA: "29 boyz + boss nob", nameA0: "Boyz Choppa", nameA1: "Boss Nob Choppa", nameA2: "Boss Nob Big Choppa", pointsA: "245",
        optionsA0: {
            "hit_modifier": "0",
            "wound_modifier": "0",
            "reroll_hits": "none",
            "reroll_wounds": "none",
            "dakka3": "none",
            "auto_wounds_on": "none",
            "is_blast": "no",
            "auto_hit": "no",
            "wounds_by_2D6": "no"
        },
        optionsA1: {
            "hit_modifier": "0",
            "wound_modifier": "0",
            "reroll_hits": "none",
            "reroll_wounds": "none",
            "dakka3": "none",
            "auto_wounds_on": "none",
            "is_blast": "no",
            "auto_hit": "no",
            "wounds_by_2D6": "no"
        }, optionsA2: {
            "hit_modifier": "0",
            "wound_modifier": "0",
            "reroll_hits": "none",
            "reroll_wounds": "none",
            "dakka3": "none",
            "auto_wounds_on": "none",
            "is_blast": "no",
            "auto_hit": "no",
            "wounds_by_2D6": "no"
        }
        };
    } else if (letter == "B") {
        return {AB0: "D6", APB0: "5", DB0: "D6", SB0: "2D6", WSBSB0: "5", nameB0: "Shokk Attack Gun", nameB: "SAG Big Mek", pointsB: "120",
        optionsB0: {
            "hit_modifier": "0",
            "wound_modifier": "0",
            "reroll_hits": "none",
            "reroll_wounds": "none",
            "dakka3": "none",
            "auto_wounds_on": "none",
            "is_blast": "no",
            "auto_hit": "no",
            "wounds_by_2D6": "no"
          }
        };
    } else {
        console.log("no init params for letter: " + letter);
    }
}
