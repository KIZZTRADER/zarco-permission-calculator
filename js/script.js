// Permissions values 
const perms = {
    generalViewChannels: 1024,
    generalCreateInvite: 1,
    generalKickMembers: 2,
    generalBanMembers: 4,
    generalAdministrator: 8,
    generalManageChannels: 16,
    generalManageGuild: 32,
    generalChangeNickname: 67108864,
    generalManageNicknames: 134217728,
    generalManageRoles: 268435456,
    generalManageWebhooks: 536870912,
    generalManageEmojis: 1073741824,
    generalViewAuditLog: 128,
    generalViewGuildInsights: 524288,
    generalManageEvents: 8589934592,
    textAddReactions: 64,
    textSendMessages: 2048,
    textSendMessagesThreads: 274877906944,
    textCreatePublicThreads: 34359738368,
    textCreatePrivateThreads: 68719476736,
    textSendTTSMessages: 4096,
    textManageMessages: 8192,
    textManageThreads: 17179869184,
    textEmbedLinks: 16384,
    textAttachFiles: 32768,
    textReadMessageHistory: 65536,
    textMentionEveryone: 131072,
    textUseExternalEmojis: 262144,
    textUseExternalStickers: 137438953472,
    textUseSlashCommands: 2147483648,
    voiceConnect: 1048576,
    voiceSpeak: 2097152,
    voiceStream: 512,
    voiceMuteMembers: 4194304,
    voiceDeafenMembers: 8388608,
    voiceMoveMembers: 16777216,
    voiceUseVAD: 33554432,
    voiceStartActivities: 549755813888,
    voicePrioritySpeaker: 256,
    voiceStageRequestSpeak: 4294967296
};

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i><span>Dark Mode</span>';
    }
});

// Recalculate permissions
function recalculate(e, t, n) {
    t = t || 0;
    let a = [];
    
    for (let s in perms) {
        if (s !== "voiceViewChannel" && document.getElementById(s).checked) {
            t += perms[s];
            a.push("0x" + perms[s].toString(16));
        }
    }
    
    a = " = " + a.join(" | ");
    document.getElementById("number").innerHTML = "" + t;
    document.getElementById("equation").innerHTML = t + a;
    
    if (!n) setHash("" + t);
    
    if (document.getElementById("clientID").value) {
        let o = document.getElementById("clientID").value;
        if (o.match(/^\d{17,18}$/)) {
            document.getElementById("clientID").className = "form-input success";
            document.getElementById("invite").className = "oauth-link";
        } else {
            document.getElementById("clientID").className = "form-input error";
            document.getElementById("invite").className = "oauth-link disabled";
        }
        
        let i = document.getElementById("oauthScopes").value;
        let c = "https://discord.com/oauth2/authorize?client_id=" + o + "&scope=" + (i = i ? encodeURIComponent(i.trim()) : "bot") + "&permissions=" + t;
        
        if (document.getElementById("oauthCodeGrant").checked) {
            c += "&response_type=code";
        }
        
        if (document.getElementById("oauthRedirect").value) {
            c += "&redirect_uri=" + encodeURIComponent(document.getElementById("oauthRedirect").value);
        }
        
        document.getElementById("invite").className = "oauth-link";
        document.getElementById("invite").innerHTML = c;
        document.getElementById("invite").href = c;
    } else {
        document.getElementById("clientID").className = "form-input error";
        document.getElementById("invite").className = "oauth-link disabled";
        document.getElementById("invite").innerHTML = "https://discord.com/oauth2/authorize?client_id=INSERT_CLIENT_ID_HERE&scope=bot&permissions=" + (t + "").split("=")[0].trim();
        document.getElementById("invite").href = "#";
    }
}

// Set hash for URL
function setHash(e) {
    if (history.pushState) {
        history.pushState(null, null, "#" + e);
    } else {
        window.location.hash = "#" + e;
    }
}

// Get hash from URL
function getHash(e) {
    return (e = e || window.location.hash) && e.length > 1 ? e.substring(1) : null;
}

// Sync checkboxes with hash
function syncCheckboxes(e) {
    let t = Math.floor(e / 4294967296);
    let n = Math.floor(e % 4294967296);
    
    for (let a in perms) {
        if (perms[a] >= 4294967296 && t & Math.floor(perms[a] / 4294967296) || 
            perms[a] < 4294967296 && n & perms[a]) {
            document.getElementById(a).checked = true;
        } else {
            document.getElementById(a).checked = false;
        }
    }
}

// Handle popstate and hashchange
window.onpopstate = function(e) {
    syncCheckboxes(+getHash(e.target.location.hash));
    recalculate(null, null, true);
};

window.onhashchange = function(e) {
    syncCheckboxes(+getHash(e.target.location.hash));
    recalculate(null, null, true);
};

// Initialize
syncCheckboxes(+getHash());
recalculate(null, null, true);
