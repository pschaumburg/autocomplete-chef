'use babel';

// Should distinguish between helpers, helpers-<provider> and dynamics-<pack>
import suggestionsHelpersDsl from '../data/chef-dslhelpers';
import suggestionsHelpersMetadata from '../data/chef-metadata';
// import suggestionsHelpersProperties from '../data/chef-properties';
// import suggestionsHelpersRecipes from '../data/chef-recipes';

class ChefProvider {
	constructor() {
		this.selector = '.source.chef';
		this.suggestions = this.initSuggestions();
	}

	// TODO: Read all files in data/ as JSON and concatenate
	initSuggestions() {
		let temp = suggestionsHelpersDsl;
		temp = temp.concat(suggestionsHelpersMetadata);
		// ...
		// temp = temp.concat(suggestionsHelpersProperties);
		// ...
		// temp = temp.concat(suggestionsHelpersRecipes);
		// ...

		return temp;
	}

	// getOptimisticVersion(version) {
	// 	let components = version.split('.')
	// 	let optimistic = components[0] + '.' + components[1]
	// 	return optimistic
	// }

	getSuggestions(options) {
		const { prefix } = options;

		if (prefix.length >= 1) {
			return this.findMatchingSuggestions(prefix);
		}
	}

  // TODO: Implement dynamic-scope + expansion of options
	findMatchingSuggestions(prefix) {
		let prefixLower = prefix.toLowerCase();
		let matchingSuggestions = this.suggestions.filter((suggestion) => {
			let textLower = suggestion.snippet.toLowerCase();
			return textLower.startsWith(prefixLower);
		});

		return matchingSuggestions.map(this.inflateSuggestion);
	}

	// clones a suggestion object to a new object with some shared additions
	// cloning also fixes an issue where selecting a suggestion won't insert it
	inflateSuggestion(suggestion) {
		// Check, if type is set, otherwise set to none
		// TODO: Prove, why this thing doesn't work right now
		var suggestiontypes:
		suggestiontypes = ['Resource', 'Helper', 'Metadata'];
		let actype = (suggestiontypes.indexOf(suggestiontypes == suggestion.type )) ? suggestion.type:'';

		// Not set currently
		let replacementPrefix = suggestion.replacementPrefix;

		// Set description: Show code, which will be set, when pressing enter; followed by description
		// -> suggestion.snippet (cleaned up without $(1:xxx) $(2:yyy))+ suggestion.description
		// TODO: Use detail info from suggestion.parameters and create text
		let desc = suggestion.description;

		// set icon, showing up in dropdown
		// TODO: Implement automatic detection, based upon suggestiontypes
		// TODO: Add options for iconcolor, iconbackgroundcolor and icon
		// TODO: Define default color behaviours, if nothing is set -> defaults
		// Used icons based on GitHub: https://octicons.github.com/
		let cicon;
		if ( suggestion.type == 'Resource' ) {
			let cicon = '<div style="background-color:' + suggestion.iconcolor + ';"><i class="icon-' + suggestion.icon + '"></i></div>';
		} else if ( suggestion.type == 'Helper' ){
			let cicon = '<div style="color:Red; background-color:#b6dddc;"><i class="icon-heart"></i></div>';
		} else if ( suggestion.type == 'Metadata' ) {
			let cicon = '<div style="color:Brown; background-color:#deb6d0;"><i class="icon-squirrel"></i></div>';
		} else {
			let cicon = '<div style="color:Brown; background-color:#b9deb6;"><i class="icon-squirrel"></i></div>';
		}

		// Set packagename
		let pack = suggestion.package;

		return {
			displayText: suggestion.displaytext,
			snippet: suggestion.snippet,
			descriptionMoreURL: suggestion.descriptionMoreURL,
			leftLabel: suggestion.type,
			rightLabel: pack,
			iconHTML: suggestion.icon,
			type: actype,
			descriptionMarkdown: desc
		};
	}
}
export default new ChefProvider();
