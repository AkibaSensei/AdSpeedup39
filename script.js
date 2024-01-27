const PLAYBACK_RATE_MAX = 16;
let currentMuted = false;
let currentPlaybackRate = 1;
function adSpeedup(video) {
	const callback = (mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.attributeName === "style") {
				const skipButtonContainer = document.querySelector(".ytp-ad-skip-button-container");
				if (skipButtonContainer && skipButtonContainer?.style.display !== "none") {
					const skipButton = skipButtonContainer.querySelector(".ytp-ad-skip-button-modern");
					if (skipButton) {
						skipButton.click();
					}
				}
			}
		});
		if (video.playbackRate !== PLAYBACK_RATE_MAX) {
			currentMuted = video.muted;
			currentPlaybackRate = video.playbackRate;
		}
		const isAdShowing = movie_player.classList.contains("ad-showing") || movie_player.classList.contains("ad-interrupting");
		video.muted = isAdShowing ? true : currentMuted;
		video.playbackRate = isAdShowing ? PLAYBACK_RATE_MAX : currentPlaybackRate;
	}
	new MutationObserver(callback).observe(movie_player, {
		attributeFilter: ["class", "style"],
		attributes: true,
		subtree: true,
	});
}

function run() {
	const video = document.querySelector("#movie_player video");
	if (video) {
		adSpeedup(video);
	} else {
		setTimeout(run, 100);
	}
}

window.addEventListener("load", function() {
	run();
});
