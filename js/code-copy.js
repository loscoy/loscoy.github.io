// Add copy button to code blocks
console.log('Code copy script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Create toast container
    const toastContainer = document.createElement('div');
    toastContainer.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
    `;
    document.body.appendChild(toastContainer);
    
    // Toast function
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        const backgroundColor = type === 'success' ? 'rgba(40, 167, 69, 0.9)' : 'rgba(220, 53, 69, 0.9)';
        toast.style.cssText = `
            padding: 8px 16px;
            margin-bottom: 8px;
            background-color: ${backgroundColor};
            color: white;
            border-radius: 4px;
            font-size: 14px;
            opacity: 0;
            transform: translateY(-100%);
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        `;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove toast after delay
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, 2000);
    }
    
    // Remove existing buttons
    document.querySelectorAll('.copy-button, button[data-clipboard-target]').forEach(button => button.remove());
    
    // Get all code blocks
    const codeBlocks = document.querySelectorAll('pre');
    console.log('Found code blocks:', codeBlocks.length);
    
    codeBlocks.forEach(function(block, index) {
        console.log('Processing code block', index);
        
        // Find or create wrapper
        let wrapper = block.closest('.highlight, .code-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.classList.add('code-wrapper');
            wrapper.style.cssText = `
                position: relative;
                margin-bottom: 1em;
            `;
            block.parentNode.insertBefore(wrapper, block);
            wrapper.appendChild(block);
        } else {
            wrapper.style.position = 'relative';
            wrapper.style.marginBottom = '1em';
        }
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = 'Copy';
        copyButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            min-width: 55px;
            padding: 4px 8px;
            background-color: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            font-size: 0.8em;
            opacity: 0;
            transition: all 0.2s;
            z-index: 1000;
            text-align: center;
        `;
        
        // Adjust pre element style
        block.style.cssText = `
            margin: 0;
            padding: 1em;
            position: relative;
        `;
        
        wrapper.appendChild(copyButton);
        
        let isAnimating = false;
        
        // Show button on hover
        const showButton = () => {
            if (!isAnimating) {
                copyButton.style.opacity = '1';
            }
        };
        
        const hideButton = () => {
            if (!isAnimating) {
                copyButton.style.opacity = '0';
            }
        };
        
        wrapper.addEventListener('mouseenter', showButton);
        wrapper.addEventListener('mouseleave', hideButton);
        
        // Add click event
        copyButton.addEventListener('click', function(e) {
            if (isAnimating) return;
            
            e.preventDefault();
            e.stopPropagation();
            isAnimating = true;
            
            const code = block.querySelector('code')?.textContent || block.textContent;
            
            navigator.clipboard.writeText(code).then(function() {
                showToast('Code copied to clipboard!', 'success');
                setTimeout(() => {
                    isAnimating = false;
                    if (!wrapper.matches(':hover')) {
                        copyButton.style.opacity = '0';
                    }
                }, 300);
            }).catch(function(err) {
                showToast('Failed to copy code', 'error');
                setTimeout(() => {
                    isAnimating = false;
                    if (!wrapper.matches(':hover')) {
                        copyButton.style.opacity = '0';
                    }
                }, 300);
            });
        });
    });
}); 