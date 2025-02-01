const { useState, useEffect, createElement } = React;

const PollWidget = ({ pollId, question, options, allowRetry }) => {
	const storedVotes = JSON.parse(localStorage.getItem(`poll-${pollId}`)) || {};
	const [totalVotes, setTotalVotes] = useState(() =>
		Object.values(storedVotes).reduce((sum, count) => sum + count, 0)
	);

	const [votes, setVotes] = useState(() => {
		const savedVotes = localStorage.getItem(`poll-${pollId}`);
		return savedVotes ? JSON.parse(savedVotes) : options.map(() => 0);
	});

	const [voted, setVoted] = useState(() => {
		return localStorage.getItem(`voted-${pollId}`) !== null;
	});

	const handleVote = (index) => {
		if (allowRetry && voted) return;

		const updatedVotes = [...votes];
		updatedVotes[index] += 1;

		setTotalVotes(totalVotes + 1);
		setVotes(updatedVotes);
		setVoted(true);

		localStorage.setItem(`poll-${pollId}`, JSON.stringify(updatedVotes));
		localStorage.setItem(`voted-${pollId}`, "true");
	};

	return createElement(
		"div",
		null,
		createElement("div",
			{ className: "poll-widget-default" },
			createElement("h3", null, question),
			options.map((option, index) => {
				const percentage = totalVotes ? ((votes[index] || 0) / totalVotes) * 100 : 0;
				return (
					createElement(
						"div",
						{
							key: index,
							className: "result-bar-container",
							onClick: () => handleVote(index)
						},
						voted && percentage > 0 && createElement(
							"div",
							{
								className: "result-bar",
								style: { width: `${percentage}%` }
							}
						),
						createElement("div", { className: "result-data", style: { cursor: voted && allowRetry ? 'not-allowed' : 'pointer' } },
							createElement(
								"strong",
								null,
								option
							),
							voted && createElement(
								"strong",
								null,
								`${percentage.toFixed()}% (${votes[index]})`
							)
						)
					)
				)
			})
		)
	);
};

const PollExistsException = ({ message }) => {
	return createElement(
		"div",
		null,
		message
	);
}

document.addEventListener("DOMContentLoaded", () => {
	let pollIds = [];
	const addNewPoll = document.getElementById("addNewPoll");
	const closeButton = document.getElementById("closeForm");
	const formContainer = document.getElementById("formContainer");
	const overlay = document.getElementById("overlay");
	const saveForm = document.getElementById("saveForm");
	const pollContainer = document.getElementById("pollContainer");

	addNewPoll.addEventListener("click", () => {
		formContainer.classList.add("show-modal");
		overlay.style.display = "block";
	});

	overlay.addEventListener("click", () => closeNewPollModal());
	closeButton.addEventListener("click", () => closeNewPollModal());

	saveForm.addEventListener("click", function () {
		const dataPollAttribute = {
			"pollId": document.getElementById("pollId").value,
			"question": document.getElementById("questionInput").value,
			"options": [...document.getElementsByClassName("option")].map(input => input.value).filter(value => value !== "")
		};

		const newPoll = document.createElement("div");
		newPoll.className = "poll-widget";
		newPoll.setAttribute("data-poll", JSON.stringify(dataPollAttribute))
		newPoll.setAttribute("data-allow-retry", null);

		pollContainer.appendChild(newPoll);
		pollIds = [];
		closeNewPollModal();
		renderUI();
	});

	const renderUI = () => {
		document.querySelectorAll(".poll-widget").forEach((pollDiv) => {
			const allowRetry = pollDiv.getAttribute("data-allow-retry") ?? true;
			const pollData = JSON.parse(pollDiv.getAttribute("data-poll"));
			const { error, message } = checkForErrors(pollData);

			if (error) {
				ReactDOM.render(
					createElement(PollExistsException, { message: message }),
					pollDiv
				);
			} else {
				pollIds.push(pollData.pollId);
				ReactDOM.render(
					createElement(PollWidget, {
						pollId: pollData.pollId,
						question: pollData.question,
						options: pollData.options,
						allowRetry
					}),
					pollDiv
				);
			}
		});
	}

	const closeNewPollModal = () => {
		formContainer.classList.remove("show-modal");
		overlay.style.display = "none";
	}

	const checkForErrors = (pollData) => {
		let invalidPollConfigurationError = { "error": false, "message": "" };
		// Throw error if data-poll attribute does not have any of these - pollId, question and atleast 2 options
		if (
			!(Object.hasOwn(pollData, "pollId") && pollData.pollId !== null && pollData.pollId !== "") ||
			!(Object.hasOwn(pollData, "question") && pollData.question !== null && pollData.question !== "") ||
			!(Object.hasOwn(pollData, "options") && Array.isArray(pollData.options) && pollData.options.length >= 2)
		) {
			invalidPollConfigurationError.error = true;
			invalidPollConfigurationError.message = "Invalid poll configuration. Please check documentation"
		}

		if (pollIds.includes(pollData.pollId)) {
			invalidPollConfigurationError.error = true;
			invalidPollConfigurationError.message = `Poll with Id - ${pollData.pollId} already exists.`
		}

		return invalidPollConfigurationError;
	}

	renderUI();
});
