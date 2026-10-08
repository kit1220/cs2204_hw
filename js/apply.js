class ApplyPage {
    constructor() {
        this.chosenGroups = new Map();
        this.usedRanks = new Set();
        this.usedGroups = new Set();
        
        this.initTable();
        this.initEventHandlers();
        this.initPage();
        
        this.updateLastChangeTime();
    }

    initPage() {
        this.switchDivision('optical');
        
        const opticalHeading = document.querySelector('.division-heading[data-division="optical"]');
        const bioHeading = document.querySelector('.division-heading[data-division="bio"]');
        const smartHeading = document.querySelector('.division-heading[data-division="smart"]');
        
        if (opticalHeading) opticalHeading.style.backgroundColor = 'white';
        if (bioHeading) bioHeading.style.backgroundColor = 'lightgray';
        if (smartHeading) smartHeading.style.backgroundColor = 'lightgray';
    }

    switchDivision(division) {
        document.querySelectorAll('.division-forms').forEach(form => {
            form.style.display = 'none';
        });
        
        const activeForm = document.getElementById(`${division}-forms`);
        if (activeForm) {
            activeForm.style.display = 'grid';
        }
        
        document.querySelectorAll('.division-heading').forEach(heading => {
            heading.style.backgroundColor = 'lightgray';
        });
        
        const activeHeading = document.querySelector(`.division-heading[data-division="${division}"]`);
        if (activeHeading) {
            activeHeading.style.backgroundColor = 'white';
        }
    }

    initTable() {
        const tableBody = document.getElementById('choices-table-body');
        tableBody.innerHTML = '';
        
        for (let i = 1; i <= 10; i++) {
            const row = document.createElement('tr');
            row.id = `rank-${i}`;
            row.innerHTML = `
                <td></td>
                <td></td>
                <td>${i}</td>
            `;
            tableBody.appendChild(row);
        }
    }

    initEventHandlers() {
        document.querySelectorAll('.rank-btn').forEach(button => {
            button.addEventListener('click', (e) => this.handleRankChoice(e));
        });
        
        document.getElementById('submit-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.submitChoices();
        });
        
        document.getElementById('clear-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.clearChoices();
        });
    }

    handleRankChoice(event) {
        event.preventDefault();
        
        const button = event.target;
        const form = button.closest('form');
        
        const groupLabel = form.querySelector('label');
        const groupName = groupLabel.textContent.trim();
        
        const divisionForms = form.closest('.division-forms');
        let divisionName = '';
        if (divisionForms.id.includes('optical')) {
            divisionName = 'Optical Sensing Division';
        } else if (divisionForms.id.includes('bio')) {
            divisionName = 'Bio-Sensing Division';
        } else if (divisionForms.id.includes('smart')) {
            divisionName = 'Smart Sensing Division';
        }
        
        const rankInput = form.querySelector('input[type="text"]').value.trim();
        
        if (this.validateAndAddChoice(rankInput, divisionName, groupName)) {
            this.updateTable();
            this.showSuccessMessage(groupName, parseInt(rankInput), divisionName);
            form.querySelector('input[type="text"]').value = '';
        }
    }

    validateAndAddChoice(rankInput, division, group) {
        if (!rankInput) {
            alert("Please enter the rank of chosen group");
            return false;
        }
        
        if (!/^\d+$/.test(rankInput)) {
            alert("Please enter the rank of chosen group");
            return false;
        }
        
        const rank = parseInt(rankInput);
        
        if (rank < 1 || rank > 10) {
            alert("Please enter the rank of chosen group between 1 and 10");
            return false;
        }
        
        if (this.usedGroups.has(group)) {
            alert("You have already chosen this group");
            return false;
        }
        
        if (this.usedRanks.has(rank)) {
            alert("You have already chosen this rank");
            return false;
        }
        
        this.chosenGroups.set(rank, { division, group });
        this.usedRanks.add(rank);
        this.usedGroups.add(group);
        
        return true;
    }

    updateTable() {
        for (let i = 1; i <= 10; i++) {
            const row = document.getElementById(`rank-${i}`);
            if (row) {
                row.cells[0].textContent = '';
                row.cells[1].textContent = '';
            }
        }
        
        this.chosenGroups.forEach((info, rank) => {
            const row = document.getElementById(`rank-${rank}`);
            if (row) {
                row.cells[0].textContent = info.division;
                row.cells[1].textContent = info.group;
            }
        });
        
        document.getElementById('total-groups').textContent = this.chosenGroups.size;
        
        this.updateLastChangeTime();
    }

    showSuccessMessage(groupName, rank, division) {
        const ordinal = this.getOrdinal(rank);
        alert(`You have chosen ${groupName} as your ${ordinal} chosen group in ${division} successfully`);
    }

    getOrdinal(n) {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    updateLastChangeTime() {
        const now = new Date();
        const timeString = now.toLocaleString();
        document.getElementById('last-change-time').textContent = `Last Change Time: ${timeString}`;
    }

    submitChoices() {
        const errorDiv = document.getElementById('error-message');
        const successDiv = document.getElementById('success-message');
        
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';
        
        if (this.chosenGroups.size === 0) {
            errorDiv.textContent = "You have not chosen any group.";
            errorDiv.style.display = 'block';
            return;
        }
        
        const hasGap = this.checkForGaps();
        
        if (hasGap.found) {
            const gapMessage = this.getGapMessage(hasGap.gaps);
            errorDiv.textContent = gapMessage;
            errorDiv.style.display = 'block';
            return;
        }
        
        const now = new Date();
        successDiv.textContent = `You have successfully submitted your application at time ${now.toLocaleString()}`;
        successDiv.style.display = 'block';
    }

    checkForGaps() {
        if (this.usedRanks.size === 0) {
            return { found: false, gaps: [] };
        }
        
        const sortedRanks = Array.from(this.usedRanks).sort((a, b) => a - b);
        const maxRank = sortedRanks[sortedRanks.length - 1];
        
        const gaps = [];
        
        for (let rank = 1; rank < maxRank; rank++) {
            if (!this.usedRanks.has(rank)) {
                gaps.push(rank);
            }
        }
        
        return {
            found: gaps.length > 0,
            gaps: gaps
        };
    }

    getGapMessage(gaps) {
        if (gaps.length === 0) return "";
        
        const ordinalGaps = gaps.map(gap => this.getOrdinal(gap));
        
        if (ordinalGaps.length === 1) {
            return `You have not chosen your ${ordinalGaps[0]} chosen group, you can not leave any gap between your chosen groups`;
        } else {
            const gapsText = ordinalGaps.map(gap => gap + ' chosen group').join(',');
            return `You have not chosen your ${gapsText}, you can not leave any gap between your chosen groups`;
        }
    }

    clearChoices() {
        this.chosenGroups.clear();
        this.usedRanks.clear();
        this.usedGroups.clear();
        this.updateTable();
        
        const successDiv = document.getElementById('success-message');
        const errorDiv = document.getElementById('error-message');
        
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
        
        successDiv.textContent = "All choices have been cleared.";
        successDiv.style.display = 'block';
        
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.applyPage = new ApplyPage();
});

function switchDivision(division) {
    if (window.applyPage) {
        window.applyPage.switchDivision(division);
    }
}