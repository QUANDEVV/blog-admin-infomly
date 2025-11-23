/**
 * Custom Image Extension for TipTap
 * 
 * Purpose: Allow editing images directly in the editor
 * Features:
 * - Click to edit image
 * - Replace image
 * - Update alt text
 * - Delete image
 */

import Image from '@tiptap/extension-image'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export const EditableImage = Image.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            onImageClick: null, // Callback when image is clicked
        }
    },

    addAttributes() {
        return {
            ...this.parent?.(),
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            title: {
                default: null,
            },
            width: {
                default: null,
            },
            height: {
                default: null,
            },
            class: {
                default: 'cursor-pointer hover:ring-2 hover:ring-blue-500 hover:opacity-90 transition-all rounded',
            },
        }
    },

    addProseMirrorPlugins() {
        const { onImageClick } = this.options

        return [
            new Plugin({
                key: new PluginKey('imageClick'),
                props: {
                    handleClickOn(view, pos, node, nodePos, event) {
                        // Check if clicked element is an image
                        if (node.type.name === 'image') {
                            event.preventDefault()
                            
                            // Get image attributes
                            const imageUrl = node.attrs.src
                            const imageAlt = node.attrs.alt || ''
                            
                            // Call the callback with image data and position
                            if (onImageClick) {
                                onImageClick({
                                    url: imageUrl,
                                    alt: imageAlt,
                                    pos: nodePos,
                                    node,
                                })
                            }
                            
                            return true
                        }
                        return false
                    },
                },
            }),
        ]
    },
})
